import { expect, test, describe, afterAll } from "bun:test";
import { spawnSync } from "node:child_process";
import { join } from "node:path";
import { readdirSync, unlinkSync, existsSync } from "node:fs";

describe("Migration Script", () => {
  const scriptPath = join(import.meta.dir, "create-migration.ts");
  const migrationsDir = join(import.meta.dir, "..", "migrations");

  afterAll(() => {
    if (existsSync(migrationsDir)) {
      const files = readdirSync(migrationsDir);
      for (const file of files) {
        if (file.endsWith(".ts") && file.includes("_test-migration")) {
          unlinkSync(join(migrationsDir, file));
        }
      }
    }
  });

  test("should create a new migration file with correct content", () => {
    const migrationName = "test-migration";
    const result = spawnSync("bun", ["run", scriptPath, migrationName]);
    expect(result.status).toBe(0);
    const files = readdirSync(migrationsDir);
    const migrationFile = files.find(f => f.endsWith(`_${migrationName}.ts`));
    expect(migrationFile).toBeDefined();
    if (migrationFile) {
      const filePath = join(migrationsDir, migrationFile);
      const text = spawnSync("cat", [filePath]).stdout.toString();
      expect(text).toContain('import type { DatabaseConnection } from "@infra/database";');
      expect(text).toContain('export async function up(connection: DatabaseConnection): Promise<void>');
    }
  });

  test("should fail if no migration name is provided", () => {
    const result = spawnSync("bun", ["run", scriptPath]);
    expect(result.status).toBe(1);
  });
});
