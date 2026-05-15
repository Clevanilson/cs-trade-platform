import type { DatabaseConnection } from "../database";

export async function up(connection: DatabaseConnection): Promise<void> {
  await connection.query(`
    CREATE TABLE users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    )
  `);
}
