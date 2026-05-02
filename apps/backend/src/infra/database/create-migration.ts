import { join } from "node:path";

const migrationName = process.argv[2];
if (!migrationName) {
  console.error("Please provide a migration name");
  process.exit(1);
}

const timestamp = new Date().toISOString().replace(/\D/g, "").slice(0, 14);
const fileName = `${timestamp}_${migrationName}.ts`;
const targetDir = join(import.meta.dir, "..", "migrations");
const filePath = join(targetDir, fileName);
const content = `import type { DatabaseConnection } from "@infra/database";

export async function up(connection: DatabaseConnection): Promise<void> {
  // TODO: Implement migration
}
`;

await Bun.write(filePath, content);
console.log(`Migration created at ${filePath}`);
