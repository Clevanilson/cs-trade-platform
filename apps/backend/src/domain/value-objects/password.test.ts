import { describe, expect, it } from "bun:test";
import { Password } from "./password";

describe("Password VO", () => {
  it("should hash the password with argon2id", () => {
    const sut = Password.create("strongPass12!");
    expect(sut.value).toMatch(/^\$argon2id\$/);
  });

  it("should not store plain text", () => {
    const plain = "strongPass12!";
    const sut = Password.create(plain);
    expect(sut.value).not.toBe(plain);
  });

  it("should throw if password is too short", () => {
    expect(() => Password.create("short")).toThrow(
      "Password must have at least 8 characters",
    );
  });

  it("should throw if password is too long", () => {
    expect(() => Password.create("a".repeat(65))).toThrow(
      "Password cannot have more than 64 characters",
    );
  });

  it("should throw if password has increasing sequence", () => {
    expect(() => Password.create("pass123abc")).toThrow(
      "Password cannot contain common sequences",
    );
  });

  it("should throw if password has decreasing sequence", () => {
    expect(() => Password.create("pass321fed")).toThrow(
      "Password cannot contain common sequences",
    );
  });

  it("should return true when comparing correct password", () => {
    const plain = "strongPass12!";
    const sut = Password.create(plain);
    expect(sut.compare(plain)).toBe(true);
  });

  it("should return false when comparing wrong password", () => {
    const sut = Password.create("strongPass12!");
    expect(sut.compare("wrongPass12!")).toBe(false);
  });
});
