import { HELLO_WORLD } from "@cs-trade-platform/shared";
import { SQLiteAdapter } from "./infra/database";
import { BunHttpServer, HttpMethod, HttpStatus } from "./infra/http";

const db = new SQLiteAdapter();

// Initialize table
await db.query(`
  CREATE TABLE IF NOT EXISTS test_table (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    value REAL
  )
`);

const httpServer = new BunHttpServer();

httpServer.register(HttpMethod.GET, "/save", async () => {
  const randomNumber = Math.random();
  await db.query("INSERT INTO test_table (value) VALUES (?)", [randomNumber]);
  return {
    status: HttpStatus.OK,
    data: { message: "Saved!", value: randomNumber },
  };
});

httpServer.register(HttpMethod.GET, "/", async () => {
  const results = await db.query("SELECT * FROM test_table");
  return {
    status: HttpStatus.OK,
    data: { hello: HELLO_WORLD, data: results },
  };
});

const port = Number(process.env.PORT) || 3000;
await httpServer.start(port);

console.log(`Backend listening on http://localhost:${port}`);
