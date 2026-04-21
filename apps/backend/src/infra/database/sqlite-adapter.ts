import { Database } from "bun:sqlite";
import type { DatabaseConnection } from "./database-connection";

export class SQLiteAdapter implements DatabaseConnection {
  private db: Database;

  constructor(filename = ":memory:") {
    this.db = new Database(filename);
  }

  async query<T>(statement: string, params: unknown[] = []): Promise<T[]> {
    const query = this.db.query(statement);
    return query.all(...(params as (string | number | boolean | null)[])) as T[];
  }

  async close(): Promise<void> {
    this.db.close();
  }
}
