import { beforeEach, describe, expect, it } from "bun:test";
import { USERS_REPOSITORY_TOKEN } from "@application/repositories";
import { di } from "@cs-trade-platform/di";
import { DATABASE_CONNECTION_TOKEN, MigrationRunner, SQLiteAdapter } from "@infra/database";
import { UsersDatabaseRepository } from "@infra/repositories/users-database-repository";
import { Signup } from "./signup";

describe("Signup", () => {
  let db: SQLiteAdapter;

  beforeEach(async () => {
    db = new SQLiteAdapter(":memory:");
    di.register(DATABASE_CONNECTION_TOKEN, db);
    const migrationRunner = new MigrationRunner(db);
    await migrationRunner.run();
    di.register(USERS_REPOSITORY_TOKEN, new UsersDatabaseRepository());
  });

  it("should create a user and return the id", async () => {
    const signup = new Signup();
    const input = {
      name: "John Doe",
      email: "john.doe@example.com",
      password: "Safe-Password-124",
    };
    const output = await signup.execute(input);
    expect(output.id).toBeDefined();
    const usersRepository = di.inject(USERS_REPOSITORY_TOKEN);
    const savedUser = await usersRepository.getByEmail(input.email);
    expect(savedUser).toBeDefined();
    expect(savedUser?.name).toBe(input.name);
    expect(savedUser?.email).toBe(input.email);
    // Password should be hashed (not the plain text)
    expect(savedUser?.comparePassword(input.password)).toBe(true);
  });

  it("should throw an error if the email is already in use", async () => {
    const signup = new Signup();
    const input = {
      name: "John Doe",
      email: "john.doe@example.com",
      password: "Safe-Password-124",
    };
    await signup.execute(input);
    await expect(signup.execute(input)).rejects.toThrow("User already exists");
  });
});
