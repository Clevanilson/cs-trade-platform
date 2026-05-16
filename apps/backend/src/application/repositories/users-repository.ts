import { InjectionToken } from "@cs-trade-platform/di";
import type { User } from "@domain/entities";

export interface UsersRepository {
  getById(id: number): Promise<User | undefined>;
  getByEmail(email: string): Promise<User | undefined>;
  save(user: User): Promise<number>;
  update(user: User): Promise<void>;
}

export const USERS_REPOSITORY_TOKEN = new InjectionToken<UsersRepository>("UserRepository");
