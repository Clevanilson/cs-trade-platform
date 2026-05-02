import { describe, expect, it } from "bun:test";
import { Email } from "./email";

describe("Email VO", () => {
  it("should create a valid email", () => {
    const sut = new Email("test@example.com");
    expect(sut.value).toBe("test@example.com");
  });

  it("should normalize email to lowercase", () => {
    const sut = new Email("TEST@EXAMPLE.COM");
    expect(sut.value).toBe("test@example.com");
  });

  it("should trim email", () => {
    const sut = new Email("  test@example.com  ");
    expect(sut.value).toBe("test@example.com");
  });

  it("should throw if email is empty", () => {
    expect(() => new Email("")).toThrow("Email cannot be empty");
    expect(() => new Email("   ")).toThrow("Email cannot be empty");
  });

  it("should throw if email is invalid", () => {
    expect(() => new Email("invalid-email")).toThrow("Invalid email format");
    expect(() => new Email("test@")).toThrow("Invalid email format");
    expect(() => new Email("@example.com")).toThrow("Invalid email format");
  });
});
