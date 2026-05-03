import { afterAll, beforeAll, describe, expect, it } from "bun:test";
import { BunHttpServer } from "./bun-http-server";
import { HttpMethod } from "./http-method";
import { HttpStatus } from "./http-status";

describe("BunHttpServer", () => {
  let server: BunHttpServer;
  const port = 3001;
  const baseUrl = `http://localhost:${port}`;

  beforeAll(async () => {
    server = new BunHttpServer();
    await server.start(port);
  });

  afterAll(async () => {
    await server.stop();
  });

  it("should register and handle a GET request", async () => {
    server.register(HttpMethod.GET, "/test", async () => {
      return {
        status: HttpStatus.OK,
        data: { message: "success" },
      };
    });
    const response = await fetch(`${baseUrl}/test`);
    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data).toEqual({ message: "success" });
  });

  it("should handle route parameters", async () => {
    server.register(HttpMethod.GET, "/users/:id", async ({ params }) => {
      return {
        status: HttpStatus.OK,
        data: { id: params.id },
      };
    });
    const response = await fetch(`${baseUrl}/users/123`);
    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data).toEqual({ id: "123" });
  });

  it("should handle query parameters", async () => {
    server.register(HttpMethod.GET, "/search", async ({ query }) => {
      return {
        status: HttpStatus.OK,
        data: { q: query.q },
      };
    });
    const response = await fetch(`${baseUrl}/search?q=bun`);
    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data).toEqual({ q: "bun" });
  });

  it("should return 404 for unknown routes", async () => {
    const response = await fetch(`${baseUrl}/unknown`);
    expect(response.status).toBe(404);
  });

  it("should handle responses with no data", async () => {
    server.register(HttpMethod.GET, "/no-data", async () => {
      return {
        status: HttpStatus.NO_CONTENT,
      };
    });
    const response = await fetch(`${baseUrl}/no-data`);
    expect(response.status).toBe(204);
    const text = await response.text();
    expect(text).toBe("");
  });
});
