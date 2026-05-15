import type { DatabaseConnection } from "./database-connection";
import { join } from "node:path";
import { readdir } from "node:fs/promises";

export class MigrationRunner {
  constructor(private readonly connection: DatabaseConnection) {}

  async run(): Promise<void> {
    const migrationsDir = join(import.meta.dir, "..", "migrations");
    const files = await readdir(migrationsDir);
    const migrationFiles = files
      .filter((f) => f.endsWith(".ts") || f.endsWith(".js"))
      .sort();

    for (const file of migrationFiles) {
      const migration = await import(join(migrationsDir, file));
      if (typeof migration.up === "function") {
        await migration.up(this.connection);
      }
    }
  }
}
