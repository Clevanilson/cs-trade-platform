import { describe, expect, it } from "bun:test";
import { DomainError } from "@cs-trade-platform/domain";
import { BunHttpServer } from "./bun-http-server";
import { HttpMethod } from "./http-method";
import { HttpStatus } from "./http-status";

describe("BunHttpServer", () => {
  it("should register a route and handle a request", async () => {
    const server = new BunHttpServer();
    server.register(HttpMethod.GET, "/test", async () => ({
      status: HttpStatus.OK,
      data: { message: "Hello World" },
    }));
    await server.start(3001);
    const response = await fetch("http://localhost:3001/test");
    const data = await response.json();
    expect(response.status).toBe(HttpStatus.OK);
    expect(data).toEqual({ message: "Hello World" });
    await server.stop();
  });

  it("should handle route params", async () => {
    const server = new BunHttpServer();
    server.register(HttpMethod.GET, "/test/:id", async ({ params }) => ({
      status: HttpStatus.OK,
      data: { id: params.id },
    }));
    await server.start(3002);
    const response = await fetch("http://localhost:3002/test/123");
    const data = await response.json();
    expect(response.status).toBe(HttpStatus.OK);
    expect(data).toEqual({ id: "123" });
    await server.stop();
  });

  it("should handle query params", async () => {
    const server = new BunHttpServer();
    server.register(HttpMethod.GET, "/test", async ({ query }) => ({
      status: HttpStatus.OK,
      data: { search: query.search },
    }));
    await server.start(3003);
    const response = await fetch("http://localhost:3003/test?search=something");
    const data = await response.json();
    expect(response.status).toBe(HttpStatus.OK);
    expect(data).toEqual({ search: "something" });
    await server.stop();
  });

  it("should handle post body", async () => {
    const server = new BunHttpServer();
    server.register(HttpMethod.POST, "/test", async ({ body }) => ({
      status: HttpStatus.CREATED,
      data: body,
    }));
    await server.start(3004);
    const response = await fetch("http://localhost:3004/test", {
      method: HttpMethod.POST,
      body: JSON.stringify({ name: "John" }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    expect(response.status).toBe(HttpStatus.CREATED);
    expect(data).toEqual({ name: "John" });
    await server.stop();
  });

  it("should return 404 for unknown routes", async () => {
    const server = new BunHttpServer();
    await server.start(3005);
    const response = await fetch("http://localhost:3005/unknown");
    expect(response.status).toBe(HttpStatus.NOT_FOUND);
    await server.stop();
  });

  it("should return 400 for DomainError", async () => {
    const server = new BunHttpServer();
    server.register(HttpMethod.GET, "/error", async () => {
      throw new DomainError({ message: "Custom domain error" });
    });
    await server.start(3006);
    const response = await fetch("http://localhost:3006/error");
    const data = await response.json();
    expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    expect(data).toEqual({ message: "Custom domain error" });
    await server.stop();
  });

  it("should return 400 for DomainError with default message", async () => {
    const server = new BunHttpServer();
    server.register(HttpMethod.GET, "/error-default", async () => {
      throw new DomainError();
    });
    await server.start(3007);
    const response = await fetch("http://localhost:3007/error-default");
    const data = await response.json();
    expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    expect(data).toEqual({ message: "Invalid data" });
    await server.stop();
  });
});
