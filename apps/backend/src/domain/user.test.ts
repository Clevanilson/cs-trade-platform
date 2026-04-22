import { beforeEach, describe, expect, it } from "bun:test";
import { User, UserBuilder } from "./user";

describe("User Entity", () => {
  let sutBuilder: UserBuilder;

  it("should create a new user and hash the password", () => {
    const sut = new User(sutBuilder);
    expect(sut.id).toBeUndefined();
    expect(sut.name).toBe(sutBuilder.name);
    expect(sut.email).toBe(sutBuilder.email);
    expect(sut.password).toMatch(/^\$argon2id\$/);
    expect(sut.comparePassword(sutBuilder.password)).toBe(true);
  });

  it("should create an existing user with a pre-hashed password", () => {
    sutBuilder.id = "123";
    sutBuilder.password = "$argon2id$v=19$m=65536,t=2,p=1$hashedpassword";
    const sut = new User(sutBuilder);
    expect(sut.password).toBe(sutBuilder.password);
  });

  it("should correctly compare password", () => {
    const sut = new User(sutBuilder);
    expect(sut.comparePassword(sutBuilder.password)).toBe(true);
    expect(sut.comparePassword("wrongpassword")).toBe(false);
  });

  beforeEach(() => {
    sutBuilder = {
      name: "John Doe",
      email: "john@example.com",
      password: "SafePassword12!",
    };
  });
});
