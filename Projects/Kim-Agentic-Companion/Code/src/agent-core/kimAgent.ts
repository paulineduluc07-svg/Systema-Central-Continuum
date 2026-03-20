import { generateKimReply } from "./llm.js";
import { InMemoryMemoryStore } from "./memoryStore.js";
import { McpClient } from "../mcp-gateway/mcpClient.js";
import { McpPolicy } from "../mcp-gateway/mcpPolicy.js";
import { RequestedTool, ToolResult } from "../shared/types.js";

export interface AgentInput {
  userId: string;
  message: string;
  grantedTools?: string[];
  requestedTool?: RequestedTool;
}

export interface AgentOutput {
  reply: string;
  tool?: ToolResult;
}

export class KimAgent {
  constructor(
    private readonly memory: InMemoryMemoryStore,
    private readonly mcpPolicy: McpPolicy,
    private readonly mcpClient: McpClient
  ) {}

  async respond(input: AgentInput): Promise<AgentOutput> {
    this.memory.append(input.userId, "user", input.message);

    let toolResult: ToolResult | undefined;
    let toolSummary: string | undefined;

    if (input.requestedTool) {
      toolResult = await this.handleTool(input.requestedTool, input.grantedTools ?? []);
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

  private async handleTool(requestedTool: RequestedTool, grantedTools: string[]): Promise<ToolResult> {
    const decision = this.mcpPolicy.evaluate({
      toolName: requestedTool.name,
      userGrantedScopes: grantedTools,
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
      detail: "mcp_execution_success"
    };
  }
}