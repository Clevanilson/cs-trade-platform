import { describe, expect, it } from "bun:test";
import { InjectionToken, di } from "./index";

describe("DI", () => {
  it("should register and inject a value", () => {
    const token = new InjectionToken<string>("test");
    const value = "hello world";
    di.register(token, value);
    const result = di.inject(token);
    expect(result).toBe(value);
  });

  it("should throw error if dependency is not found", () => {
    const token = new InjectionToken<number>("missing");
    expect(() => di.inject(token)).toThrow("Dependency not found for token: missing");
  });

  it("should maintain type safety", () => {
    const token = new InjectionToken<{ id: number }>("obj");
    const value = { id: 1 };
    di.register(token, value);
    const result = di.inject(token);
    expect(result.id).toBe(1);
  });
});
