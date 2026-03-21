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

function buildSystemTimeResult(input) {
  const timezone = typeof input.timezone === "string" && input.timezone.trim().length > 0 ? input.timezone.trim() : "UTC";
  const now = new Date();

  try {
    const formatter = new Intl.DateTimeFormat("en-CA", {
      dateStyle: "full",
      timeStyle: "long",
      timeZone: timezone
    });

    return {
      ok: true,
      nowIso: now.toISOString(),
      timezone,
      display: formatter.format(now)
    };
  } catch {
    return {
      ok: false,
      error: "invalid_timezone",
      detail: "timezone is invalid"
    };
  }
}

function readHtmlTitle(html) {
  if (typeof html !== "string" || !html) {
    return null;
  }

  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (!match || typeof match[1] !== "string") {
    return null;
  }

  return match[1].replace(/\s+/g, " ").trim() || null;
}

async function buildWebFetchResult(input) {
  const url = typeof input.url === "string" ? input.url.trim() : "";
  if (!url || !/^https?:\/\//i.test(url)) {
    return {
      ok: false,
      error: "invalid_web_fetch_payload",
      detail: "url must be a valid http(s) URL"
    };
  }

  try {
    const response = await fetch(url, {
      method: "GET",
      redirect: "follow"
    });

    const body = await response.text();
    const title = readHtmlTitle(body);

    return {
      ok: true,
      result: {
        url,
        finalUrl: response.url || url,
        status: response.status,
        ok: response.ok,
        protocolFallbackUsed: false,
        title,
        snippet: body.slice(0, 1000)
      }
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "failed to fetch URL";
    if (url.startsWith("https://")) {
      const fallbackUrl = `http://${url.slice("https://".length)}`;
      try {
        const fallbackResponse = await fetch(fallbackUrl, {
          method: "GET",
          redirect: "follow"
        });
        const fallbackBody = await fallbackResponse.text();
        const fallbackTitle = readHtmlTitle(fallbackBody);
        return {
          ok: true,
          result: {
            url,
            finalUrl: fallbackResponse.url || fallbackUrl,
            status: fallbackResponse.status,
            ok: fallbackResponse.ok,
            protocolFallbackUsed: true,
            title: fallbackTitle,
            snippet: fallbackBody.slice(0, 1000)
          }
        };
      } catch {
        // keep original error below
      }
    }

    return {
      ok: false,
      error: "web_fetch_failed",
      detail: message
    };
  }
}

const TOOL_CATALOG = [
  {
    name: "calendar.create_event",
    description: "Create a calendar event from title/start time",
    inputSchema: {
      type: "object",
      properties: {
        title: { type: "string" },
        startAt: { type: "string", format: "date-time" },
        endAt: { type: "string", format: "date-time" },
        timezone: { type: "string" },
        notes: { type: "string" }
      },
      required: ["title", "startAt"]
    }
  },
  {
    name: "system.get_time",
    description: "Return current server time in a given timezone",
    inputSchema: {
      type: "object",
      properties: {
        timezone: { type: "string" }
      }
    }
  },
  {
    name: "web.fetch",
    description: "Fetch a public URL and return title/status/snippet",
    inputSchema: {
      type: "object",
      properties: {
        url: { type: "string", format: "uri" }
      },
      required: ["url"]
    }
  }
];

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

  if (method === "GET" && path === "/tools") {
    return json(res, 200, {
      ok: true,
      tools: TOOL_CATALOG
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

      if (toolName === "calendar.create_event") {
        const result = buildCalendarResult(input);
        if (!result.ok) {
          return json(res, 400, result);
        }

        return json(res, 200, {
          ok: true,
          toolName,
          data: result.event
        });
      }

      if (toolName === "system.get_time") {
        const result = buildSystemTimeResult(input);
        if (!result.ok) {
          return json(res, 400, result);
        }

        return json(res, 200, {
          ok: true,
          toolName,
          data: result
        });
      }

      if (toolName === "web.fetch") {
        const result = await buildWebFetchResult(input);
        if (!result.ok) {
          return json(res, 400, result);
        }

        return json(res, 200, {
          ok: true,
          toolName,
          data: result.result
        });
      }

      return json(res, 404, {
        ok: false,
        error: "tool_not_supported",
        detail: "Supported tools: calendar.create_event, system.get_time, web.fetch"
      });
    } catch {
      return json(res, 400, { ok: false, error: "invalid_json" });
    }
  }

  return json(res, 404, { ok: false, error: "not_found" });
};
