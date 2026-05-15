import { beforeEach, describe, expect, it } from "bun:test";
import { di } from "@cs-trade-platform/di";
import { User } from "@domain/entities/user";
import { DATABASE_CONNECTION_TOKEN, MigrationRunner, SQLiteAdapter } from "../database";
import { UsersDatabaseRepository } from "./users-database-repository";

describe("UsersDatabaseRepository", () => {
  let repository: UsersDatabaseRepository;
  let db: SQLiteAdapter;

  beforeEach(async () => {
    db = new SQLiteAdapter(":memory:");
    di.register(DATABASE_CONNECTION_TOKEN, db);
    const migrationRunner = new MigrationRunner(db);
    await migrationRunner.run();
    repository = new UsersDatabaseRepository();
  });

  it("should save and get a user by id", async () => {
    const user = new User({
      name: "John Doe",
      email: "john@example.com",
      password: "Safe-Password-124",
    });
    const id = await repository.save(user);
    expect(id).toBeDefined();
    const savedUser = await repository.getById(id);
    expect(savedUser).toBeDefined();
    expect(savedUser?.name).toBe("John Doe");
    expect(savedUser?.email).toBe("john@example.com");
  });

  it("should get a user by email", async () => {
    const user = new User({
      name: "Jane Doe",
      email: "jane@example.com",
      password: "Safe-Password-124",
    });
    const id = await repository.save(user);
    const savedUser = await repository.getByEmail("jane@example.com");
    expect(savedUser).toBeDefined();
    expect(savedUser?.name).toBe(user.name);
    expect(savedUser?.email).toBe(user.email);
    expect(savedUser?.password).toBe(user.password);
    expect(savedUser?.id).toBe(id);
  });

  it("should return undefined if user not found", async () => {
    const userById = await repository.getById(999);
    const userByEmail = await repository.getByEmail("nonexistent@example.com");
    expect(userById).toBeUndefined();
    expect(userByEmail).toBeUndefined();
  });

  it("should update a user", async () => {
    const user = new User({
      name: "John Old",
      email: "john@example.com",
      password: "Safe-Password-124",
    });
    const id = await repository.save(user);
    const userToUpdate = new User({
      id,
      name: "John New",
      email: "john@example.com",
      password: "New-Safe-Password-124",
    });
    await repository.update(userToUpdate);
    const updatedUser = await repository.getById(id);
    expect(updatedUser?.name).toBe("John New");
  });
});
