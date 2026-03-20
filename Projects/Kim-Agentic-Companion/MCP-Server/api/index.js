"use strict";

function json(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader("content-type", "application/json; charset=utf-8");
  res.end(JSON.stringify(payload));
}

async function readJsonBody(req) {
  if (req.body && typeof req.body === "object") {
    return req.body;
  }

  if (typeof req.body === "string" && req.body.length > 0) {
    return JSON.parse(req.body);
  }

  const chunks = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  const raw = Buffer.concat(chunks).toString("utf8").trim();
  if (!raw) {
    return {};
  }

  return JSON.parse(raw);
}

function isAuthorized(req) {
  const expected = process.env.MCP_SERVER_API_KEY?.trim();
  if (!expected) {
    return true;
  }

  const xApiKey = (req.headers["x-api-key"] || "").toString().trim();
  const authHeader = (req.headers.authorization || "").toString();
  const bearer = authHeader.startsWith("Bearer ") ? authHeader.slice("Bearer ".length).trim() : "";

  return xApiKey === expected || bearer === expected;
}

function buildCalendarResult(input) {
  const title = typeof input.title === "string" ? input.title.trim() : "";
  const startAt = typeof input.startAt === "string" ? input.startAt.trim() : "";

  if (!title || !startAt) {
    return {
      ok: false,
      error: "invalid_calendar_payload",
      detail: "title and startAt are required"
    };
  }

  const now = Date.now();
  return {
    ok: true,
    event: {
      eventId: `evt_${now}`,
      title,
      startAt,
      endAt: typeof input.endAt === "string" ? input.endAt : null,
      timezone: typeof input.timezone === "string" ? input.timezone : "UTC",
      participants: Array.isArray(input.participants) ? input.participants : [],
      notes: typeof input.notes === "string" ? input.notes : "",
      createdAt: new Date(now).toISOString()
    }
  };
}

module.exports = async (req, res) => {
  const requestUrl = new URL(req.url || "/", "http://localhost");
  const path = requestUrl.pathname;
  const method = (req.method || "GET").toUpperCase();

  if (!isAuthorized(req)) {
    return json(res, 401, { ok: false, error: "unauthorized" });
  }

  if (method === "GET" && path === "/health") {
    return json(res, 200, {
      ok: true,
      service: "kim-mcp-server",
      timestamp: new Date().toISOString()
    });
  }

  if (method === "POST" && path === "/calendar/create-event") {
    try {
      const payload = await readJsonBody(req);
      const result = buildCalendarResult(payload);
      if (!result.ok) {
        return json(res, 400, result);
      }

      return json(res, 200, {
        ok: true,
        toolName: "calendar.create_event",
        data: result.event
      });
    } catch {
      return json(res, 400, { ok: false, error: "invalid_json" });
    }
  }

  if (method === "POST" && path === "/invoke") {
    try {
      const payload = await readJsonBody(req);
      const toolName = typeof payload.toolName === "string" ? payload.toolName : "";
      const input = payload.input && typeof payload.input === "object" ? payload.input : {};

      if (toolName !== "calendar.create_event") {
        return json(res, 404, {
          ok: false,
          error: "tool_not_supported",
          detail: "Only calendar.create_event is supported in this staging MCP server"
        });
      }

      const result = buildCalendarResult(input);
      if (!result.ok) {
        return json(res, 400, result);
      }

      return json(res, 200, {
        ok: true,
        toolName,
        data: result.event
      });
    } catch {
      return json(res, 400, { ok: false, error: "invalid_json" });
    }
  }

  return json(res, 404, { ok: false, error: "not_found" });
};
