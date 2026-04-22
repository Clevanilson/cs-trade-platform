import { HELLO_WORLD } from "@cs-trade-platform/shared";
import { SQLiteAdapter } from "./infra/database";

const db = new SQLiteAdapter();

// Initialize table
await db.query(`
  CREATE TABLE IF NOT EXISTS test_table (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    value REAL
  )
`);

const server = Bun.serve({
  port: process.env.PORT || 3000,
  async fetch(req) {
    const url = new URL(req.url);

    if (url.pathname === "/save") {
      const randomNumber = Math.random();
      await db.query("INSERT INTO test_table (value) VALUES (?)", [
        randomNumber,
      ]);
      return Response.json({ message: "Saved!", value: randomNumber });
    }

    if (url.pathname === "/") {
      const results = await db.query("SELECT * FROM test_table");
      return Response.json({ hello: HELLO_WORLD, data: results });
    }

    return new Response("Not Found", { status: 404 });
  },
});

console.log(`Backend listening on http://localhost:${server.port}`);
