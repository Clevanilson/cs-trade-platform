import { HELLO_WORLD } from "@cs-trade-platform/shared";

const server = Bun.serve({
  port: process.env.PORT || 3000,
  fetch(req) {
    const url = new URL(req.url);
    if (url.pathname === "/") {
      return new Response(HELLO_WORLD, { status: 201 });
    }

    return new Response("Not Found", { status: 404 });
  },
});

console.log(`Backend listening on http://localhost:${server.port}`);
