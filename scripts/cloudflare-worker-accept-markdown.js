/**
 * Cloudflare Worker for Accept: text/markdown Content Negotiation
 * 
 * Attach this Worker to the route: ariya-sarrafzadeh.ir/* (or ariya-sarrafzadeh.ir/)
 * It inspects incoming HTTP "Accept" headers. If an AI agent or crawler requests
 * "text/markdown", it fetches the canonical /index.md representation directly from origin
 * and returns it with Content-Type: text/markdown; charset=utf-8 and Vary: Accept.
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const accept = request.headers.get("Accept") || "";

    // Content negotiation for root homepage
    if ((url.pathname === "/" || url.pathname === "") && accept.includes("text/markdown")) {
      const markdownUrl = new URL("/index.md", request.url);
      const originResponse = await fetch(markdownUrl.toString(), {
        headers: request.headers,
      });

      const headers = new Headers(originResponse.headers);
      headers.set("Content-Type", "text/markdown; charset=utf-8");
      headers.set("Vary", "Accept, Accept-Encoding");
      headers.set("Access-Control-Allow-Origin", "*");

      return new Response(originResponse.body, {
        status: originResponse.status,
        headers,
      });
    }

    // Default passthrough to origin with standard headers
    const response = await fetch(request);
    const newHeaders = new Headers(response.headers);
    newHeaders.set("Vary", "Accept, Accept-Encoding");
    
    return new Response(response.body, {
      status: response.status,
      headers: newHeaders,
    });
  },
};
