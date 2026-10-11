import { createFileRoute } from "@tanstack/react-router";
import { valMcpRoute } from "../../val/mcp.server";

/**
 * Val's content tools over MCP, at `/api/mcp`.
 *
 * This file is only the route. The transport — which SDK, and how a
 * `ValToolResult` becomes a `CallToolResult` — is `valMcpRoute` in
 * `src/val/mcp.server.ts`. The tools, and the two checks that decide whether a
 * request may reach them, come from `@valbuild/tanstack/server` — deliberately,
 * because they are security-relevant and should not be re-implemented per app.
 *
 * Point an MCP client at `http://localhost:3000/api/mcp`. In local development
 * that is all it needs; against a deployed app in proxy mode it also needs the
 * user's own personal access token as a bearer token, which `val login` writes.
 */
export const Route = createFileRoute("/api/mcp")({
  server: {
    // Only the handlers use `valMcpRoute`. The browser build deletes them, and
    // the now-unused import goes with them. Anything else at the top of this
    // file that used it would keep `mcp.server.ts`, and the server-only
    // packages it imports, in the browser bundle — and Val's platform refuses
    // to publish that. So this file stays the route and nothing else.
    handlers: {
      GET: ({ request }) => valMcpRoute(request),
      POST: ({ request }) => valMcpRoute(request),
      DELETE: ({ request }) => valMcpRoute(request),
    },
  },
});
