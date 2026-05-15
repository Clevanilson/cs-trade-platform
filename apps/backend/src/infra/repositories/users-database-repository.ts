import type { UsersRepository } from "@application/repositories";
import { di } from "@cs-trade-platform/di";
import type { UserModel } from "@domain/dtos/user-model.dto";
import { User } from "../../domain/entities/user";
import { DATABASE_CONNECTION_TOKEN, type DatabaseConnection } from "../database";

export class UsersDatabaseRepository implements UsersRepository {
  private readonly db: DatabaseConnection;

  constructor() {
    this.db = di.inject(DATABASE_CONNECTION_TOKEN);
  }

  async getById(id: number): Promise<User | undefined> {
    const [userData] = await this.db.query<UserModel>("SELECT * FROM users WHERE id = ?", [id]);
    if (!userData) return undefined;
    return new User(userData);
  }

  async getByEmail(email: string): Promise<User | undefined> {
    const [userData] = await this.db.query<UserModel>("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (!userData) return undefined;
    return new User(userData);
  }

  async save(user: User): Promise<number> {
    const [result] = await this.db.query<{ id: number }>(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?) RETURNING id",
      [user.name, user.email, user.password],
    );
    return result.id;
  }

  async update(user: User): Promise<void> {
    await this.db.query("UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?", [
      user.name,
      user.email,
      user.password,
      user.id,
    ]);
  }
}
