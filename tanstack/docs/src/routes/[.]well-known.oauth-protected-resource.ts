import { createFileRoute } from "@tanstack/react-router";
import { valMcpMetadata } from "../val/mcp.server";

/**
 * RFC 9728 Protected Resource Metadata, at
 * `/.well-known/oauth-protected-resource`: how an MCP client discovers where to
 * authorize for this app's `/api/mcp`. (`[.]` in the file name is TanStack
 * Router's escape for a literal dot.)
 *
 * Served by the resource — this app — and it names the authorization server.
 * The *authorization server's* own metadata (RFC 8414) is not served here on
 * purpose: that document describes the issuer's endpoints and lives at the
 * issuer, and an app serving a copy would be asserting someone else's
 * configuration and would be wrong the moment it changed.
 *
 * `404` when Val has no `oauth` config, rather than an empty document. A
 * document that named no authorization server would send clients into a
 * discovery loop; a 404 tells them plainly that this deployment does not do
 * OAuth.
 */
export const Route = createFileRoute("/.well-known/oauth-protected-resource")({
  server: {
    handlers: {
      GET: ({ request }) =>
        valMcpMetadata
          ? valMcpMetadata.GET(request)
          : new Response("Not found", { status: 404 }),
      OPTIONS: ({ request }) =>
        valMcpMetadata
          ? valMcpMetadata.OPTIONS(request)
          : new Response(null, { status: 404 }),
    },
  },
});
