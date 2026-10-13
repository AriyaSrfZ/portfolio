/**
 * Cloudflare Worker: Markdown Content Negotiation (acceptmarkdown.com compliant)
 *
 * Intercepts requests to https://ariya-sarrafzadeh.ir/
 * If 'Accept: text/markdown' header is present, serves /index.md with
 * 'Content-Type: text/markdown; charset=utf-8' and 'Vary: Accept'.
 *
 * Deploy instructions:
 * 1. Go to Cloudflare Dashboard -> Workers & Pages -> Create Worker
 * 2. Paste this code and bind to route: ariya-sarrafzadeh.ir/*
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const acceptHeader = request.headers.get('Accept') || '';

    // Check if client explicitly requests Markdown for root or HTML pages
    const wantsMarkdown = acceptHeader.includes('text/markdown');

    if (wantsMarkdown && (url.pathname === '/' || url.pathname === '/index.html')) {
      const markdownUrl = new URL('/index.md', request.url);
      const mdResponse = await fetch(markdownUrl, request);

      if (mdResponse.ok) {
        const newHeaders = new Headers(mdResponse.headers);
        newHeaders.set('Content-Type', 'text/markdown; charset=utf-8');
        newHeaders.set('Vary', 'Accept');
        newHeaders.set('Access-Control-Allow-Origin', '*');

        return new Response(mdResponse.body, {
          status: 200,
          headers: newHeaders
        });
      }
    }

    // Default fetch for all other requests
    const response = await fetch(request);
    const newHeaders = new Headers(response.headers);

    // Ensure Vary: Accept is included on HTML responses to inform caches of content negotiation
    if (url.pathname === '/' || url.pathname.endsWith('.html') || url.pathname.endsWith('/')) {
      const currentVary = newHeaders.get('Vary') || '';
      if (!currentVary.includes('Accept')) {
        newHeaders.set('Vary', currentVary ? `${currentVary}, Accept` : 'Accept');
      }
    }

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders
    });
  }
};
