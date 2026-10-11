import { initValMcp } from "@valbuild/tanstack/server";
import { createMcpHandler } from "mcp-handler";
import prettier from "prettier";
import { config } from "../../val.config";
import valModules from "../../val.modules";
import prettierOptions from "../../.prettierrc.json";
import { valImageTools } from "./mcp.images.server";

/**
 * Val's content tools, ready to mount on an MCP transport.
 *
 * Separate from `val.server.ts` because the two share nothing but the modules:
 * the API serves the Studio in a browser, and this serves an agent that has
 * none. The formatter is passed to both for the same reason — a patch written
 * to disk in local development should come out formatted the way this repo
 * formats everything else, whichever path wrote it.
 *
 * The transport itself is `src/routes/api/mcp.ts`. Everything security-relevant
 * is here and in `@valbuild/mcp`: which requests may reach the tools at all,
 * and whose credential they carry.
 *
 * `.server.ts`, so TanStack Start refuses to put it in the browser bundle.
 */
const { valMcpAuthorize, valMcpTools, valMcpMetadata } = initValMcp(
  valModules,
  config,
  {
    extraTools: valImageTools,
    formatter: (code: string, filePath: string) =>
      prettier.format(code, {
        filepath: filePath,
        ...prettierOptions,
      } satisfies prettier.Options),
    /**
     * Where to authorize, when this app is configured for it.
     *
     * Read from the environment rather than hardcoded, and absent by default,
     * because the two are genuinely different deployments: local development
     * has no authorization server to talk to and wants the endpoint to work
     * without one, while a deployed app must not serve MCP to whoever asks.
     * Set both and every call needs a verified access token.
     */
    ...(process.env.VAL_OAUTH_ISSUER && process.env.VAL_MCP_RESOURCE
      ? {
          oauth: {
            issuer: process.env.VAL_OAUTH_ISSUER,
            resource: process.env.VAL_MCP_RESOURCE,
          },
        }
      : {}),
  },
);

export { valMcpAuthorize, valMcpTools, valMcpMetadata };

/**
 * The transport: `src/routes/api/mcp.ts` hands every request here.
 *
 * In this file rather than the route's, because a route file's top level is in
 * the browser bundle and this is server code through and through.
 */
const handler = createMcpHandler(
  async (server) => {
    // `mcp-handler` is stateless: it builds a fresh `McpServer` per request and
    // runs this, so registration is per request, not once at startup. That is
    // cheap and deliberately left alone — the expensive half, loading the
    // modules and building the tools, is memoised inside `initValMcp` and
    // happens once for the process however many requests arrive. What repeats
    // is the `registerTool` loop.
    //
    // Listing needs no credential, which is why it can happen out here at all.
    // Only CALLING a tool is per-caller, below.
    const tools = await valMcpTools();
    for (const tool of tools.list()) {
      server.registerTool(
        tool.name,
        {
          title: tool.title,
          description: tool.description,
          inputSchema: tool.inputSchema,
          annotations: tool.annotations,
        },
        async (args, ctx) => {
          // Authorized per call, from that call's own HTTP request: the
          // credential belongs to the caller, not to the server instance the
          // tools were registered on.
          const authorized = await valMcpAuthorize(ctx.http?.req);
          if (authorized.status === "refused") {
            return toolError(await refusalMessage(authorized.response));
          }
          const result = await authorized.tools.call(
            tool.name,
            args,
            authorized.ctx,
          );
          if (result.status === "error") {
            // In-band, so the model sees a failed tool call it can recover from
            // rather than a dead transport. The code goes in the text because
            // it is what distinguishes "try something else" from "try again".
            return toolError(`${result.code}: ${result.message}`);
          }
          return {
            content: [
              { type: "text" as const, text: JSON.stringify(result.data) },
            ],
          };
        },
      );
    }
  },
  {
    serverInfo: { name: "val", version: "1" },
  },
);

/**
 * Refuse before the protocol layer, then serve.
 *
 * The per-call check inside each tool is not enough on its own: a request that
 * should not be answered at all — a browser on another origin, or fs mode on a
 * deployed host — must not get as far as an `initialize` handshake.
 */
export async function valMcpRoute(request: Request): Promise<Response> {
  const authorized = await valMcpAuthorize(request);
  if (authorized.status === "refused") {
    return authorized.response;
  }
  return handler(request);
}

function toolError(message: string) {
  return {
    content: [{ type: "text" as const, text: message }],
    isError: true,
  };
}

/** The refusal's own message, so the reason survives into the tool result. */
async function refusalMessage(response: Response): Promise<string> {
  try {
    const body: unknown = await response.json();
    if (
      typeof body === "object" &&
      body !== null &&
      "error" in body &&
      typeof body.error === "string"
    ) {
      return body.error;
    }
  } catch {
    // fall through to the generic message
  }
  return `Val refused this MCP call (HTTP ${response.status}).`;
}
