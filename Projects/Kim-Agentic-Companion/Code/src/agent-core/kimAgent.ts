import { generateKimReply } from "./llm.js";
import { InMemoryMemoryStore } from "./memoryStore.js";
import { McpClient } from "../mcp-gateway/mcpClient.js";
import { McpPolicy } from "../mcp-gateway/mcpPolicy.js";
import { CalendarConnector } from "../mcp-gateway/connectors/calendarConnector.js";
import { RequestedTool, ToolResult, PermissionGrantState } from "../shared/types.js";

export interface AgentInput {
  userId: string;
  message: string;
  grantedTools?: string[];
  permissionGrants?: PermissionGrantState[];
  revokedTools?: string[];
  confirmationProvided?: boolean;
  requestedTool?: RequestedTool;
}

export interface AgentOutput {
  reply: string;
  tool?: ToolResult;
}

export class KimAgent {
  private readonly calendarConnector: CalendarConnector;

  constructor(
    private readonly memory: InMemoryMemoryStore,
    private readonly mcpPolicy: McpPolicy,
    private readonly mcpClient: McpClient
  ) {
    this.calendarConnector = new CalendarConnector(this.mcpClient);
  }

  async respond(input: AgentInput): Promise<AgentOutput> {
    this.memory.append(input.userId, "user", input.message);

    let toolResult: ToolResult | undefined;
    let toolSummary: string | undefined;

    const inferredTool = input.requestedTool ?? this.parseToolCommand(input.message);
    if (inferredTool) {
      toolResult = await this.handleTool(
        inferredTool,
        input.grantedTools ?? [],
        input.permissionGrants ?? [],
        input.revokedTools ?? [],
        input.confirmationProvided
      );
      toolSummary = `${toolResult.name}:${toolResult.status}`;
    }

    const reply = await generateKimReply({
      userMessage: input.message,
      memorySummary: this.memory.summarize(input.userId),
      toolSummary
    });

    this.memory.append(input.userId, "assistant", reply);

    return { reply, tool: toolResult };
  }

  async executeTool(input: {
    requestedTool: RequestedTool;
    grantedTools?: string[];
    permissionGrants?: PermissionGrantState[];
    revokedTools?: string[];
    confirmationProvided?: boolean;
  }): Promise<ToolResult> {
    return this.handleTool(
      input.requestedTool,
      input.grantedTools ?? [],
      input.permissionGrants ?? [],
      input.revokedTools ?? [],
      input.confirmationProvided
    );
  }

  private async handleTool(
    requestedTool: RequestedTool,
    grantedTools: string[],
    permissionGrants: PermissionGrantState[],
    revokedTools: string[],
    confirmationProvided?: boolean
  ): Promise<ToolResult> {
    const decision = this.mcpPolicy.evaluate({
      toolName: requestedTool.name,
      userGrantedScopes: grantedTools,
      permissionGrants,
      revokedScopes: revokedTools,
      confirmationProvided,
      isSensitive: Boolean(requestedTool.sensitive)
    });

    if (!decision.allowed) {
      return {
        name: requestedTool.name,
        status: "blocked",
        detail: decision.reason
      };
    }

    if (decision.requiresConfirmation) {
      return {
        name: requestedTool.name,
        status: "needs_confirmation",
        detail: "confirmation_required_before_mcp_execution"
      };
    }

    if (requestedTool.name === "calendar.create_event") {
      return this.calendarConnector.createEvent(requestedTool.input);
    }

    const execution = await this.mcpClient.invoke({
      toolName: requestedTool.name,
      input: requestedTool.input
    });

    if (!execution.success) {
      return {
        name: requestedTool.name,
        status: "error",
        detail: execution.error ?? "mcp_unknown_error"
      };
    }

    return {
      name: requestedTool.name,
      status: "executed",
      detail: "mcp_execution_success",
      output: execution.data
    };
  }

  private parseToolCommand(message: string): RequestedTool | undefined {
    const trimmed = message.trim();
    if (!trimmed.startsWith("/tool ")) {
      return undefined;
    }

    const command = trimmed.slice("/tool ".length).trim();
    if (!command) {
      return undefined;
    }

    const firstSpace = command.indexOf(" ");
    if (firstSpace < 0) {
      return undefined;
    }

    const toolName = command.slice(0, firstSpace).trim();
    const rawInput = command.slice(firstSpace + 1).trim();
    if (!toolName || !rawInput) {
      return undefined;
    }

    try {
      const parsed = JSON.parse(rawInput) as unknown;
      if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
        return undefined;
      }

      return {
        name: toolName,
        input: parsed as Record<string, unknown>,
        sensitive: false
      };
    } catch {
      return undefined;
    }
  }
}
