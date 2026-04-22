import { describe, expect, it } from "bun:test";
import { Name } from "./name";

describe("Name VO", () => {
  it("should create a valid name", () => {
    const sut = new Name("John Doe");
    expect(sut.value).toBe("John Doe");
  });

  it("should trim name", () => {
    const sut = new Name("  John Doe  ");
    expect(sut.value).toBe("John Doe");
  });

  it("should throw if name is empty", () => {
    expect(() => new Name("")).toThrow("Name cannot be empty");
    expect(() => new Name("   ")).toThrow("Name cannot be empty");
  });

  it("should throw if name has numbers", () => {
    expect(() => new Name("John123")).toThrow(
      "Name cannot have numbers or special characters",
    );
  });

  it("should throw if name has special characters", () => {
    expect(() => new Name("John!")).toThrow(
      "Name cannot have numbers or special characters",
    );
  });

  it("should throw if name is too long", () => {
    expect(() => new Name("a".repeat(65))).toThrow(
      "Name cannot have more than 64 characters",
    );
  });
});
