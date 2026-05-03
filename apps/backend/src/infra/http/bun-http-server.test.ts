import { afterAll, beforeAll, describe, expect, it } from "bun:test";
import { HttpClientPromiseAdapter, HttpMethod, HttpStatus } from "@cs-trade-platform/shared";
import { BunHttpServer } from "./bun-http-server";

describe("BunHttpServer", () => {
  let server: BunHttpServer;
  let client: HttpClientPromiseAdapter;
  const port = 3001;
  const baseUrl = `http://localhost:${port}`;

  beforeAll(async () => {
    server = new BunHttpServer();
    client = new HttpClientPromiseAdapter();
    await server.start(port);
  });

  afterAll(async () => {
    await server.stop();
  });

  it("should register and handle a GET request", async () => {
    server.register(HttpMethod.GET, "/test", async () => {
      return { status: HttpStatus.OK, data: "Success" };
    });
    const response = await client.request(HttpMethod.GET, `${baseUrl}/test`);
    expect(response.status).toBe(HttpStatus.OK);
    expect(response.data).toBe("Success");
  });

  it("should handle route parameters", async () => {
    server.register(HttpMethod.PATCH, "/users/:id", async ({ params }) => {
      return { status: HttpStatus.OK, data: { id: params.id } };
    });
    const response = await client.request(HttpMethod.PATCH, `${baseUrl}/users/123`);
    expect(response.status).toBe(HttpStatus.OK);
    expect(response.data).toEqual({ id: "123" });
  });

  it("should handle query parameters", async () => {
    server.register(HttpMethod.POST, "/search", async ({ query }) => {
      return { status: HttpStatus.OK, data: { q: query.q } };
    });
    const response = await client.request(HttpMethod.POST, `${baseUrl}/search?q=bun`);
    expect(response.status).toBe(HttpStatus.OK);
    expect(response.data).toEqual({ q: "bun" });
  });

  it("should return 404 for unknown routes", async () => {
    const response = await client.request(HttpMethod.PUT, `${baseUrl}/unknown`);
    expect(response.status).toBe(HttpStatus.NOT_FOUND);
  });

  it("should handle responses with no data", async () => {
    server.register(HttpMethod.DELETE, "/no-data", async () => {
      return { status: HttpStatus.NO_CONTENT };
    });
    const response = await client.request(HttpMethod.DELETE, `${baseUrl}/no-data`);
    expect(response.status).toBe(HttpStatus.NO_CONTENT);
    expect(response.data).toBe(null);
  });
});
