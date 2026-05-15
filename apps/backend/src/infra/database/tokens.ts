import { InjectionToken } from "@cs-trade-platform/di";
import type { DatabaseConnection } from "./database-connection";

export const DATABASE_CONNECTION_TOKEN = new InjectionToken<DatabaseConnection>(
  "DatabaseConnection"
);
