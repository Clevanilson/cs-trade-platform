import { USERS_REPOSITORY_TOKEN } from "@application/repositories";
import { di } from "@cs-trade-platform/di";
import { BunHttpServer, HTTP_SERVER_TOKEN, type HttpServer } from "@cs-trade-platform/infra";
import { UsersController } from "@infra/controllers";
import { UsersDatabaseRepository } from "@infra/repositories/users-database-repository";
import { DATABASE_CONNECTION_TOKEN, MigrationRunner, SQLiteAdapter } from "./infra/database";

export async function main(port = 3000): Promise<HttpServer> {
  di.clear();
  const db = new SQLiteAdapter();
  di.register(DATABASE_CONNECTION_TOKEN, db);
  const httpServer = new BunHttpServer();
  di.register(HTTP_SERVER_TOKEN, httpServer);
  const userRepository = new UsersDatabaseRepository();
  di.register(USERS_REPOSITORY_TOKEN, userRepository);
  const migration = new MigrationRunner(db);
  await migration.run();
  new UsersController();
  const _port = Number(process.env.PORT) || port;
  await httpServer.start(_port);
  console.log(`Backend listening on PORT: ${_port}`);
  return httpServer;
}
