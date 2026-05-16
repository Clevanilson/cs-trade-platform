import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { di } from "@cs-trade-platform/di";
import {
  HTTP_SERVER_TOKEN,
  type HttpClient,
  HttpClientFetchAdapter,
  HttpMethod,
  type HttpServer,
  HttpStatus,
} from "@cs-trade-platform/infra";
import { main } from "src/main";

describe("UsersController Integration Test", () => {
  let httpServer: HttpServer;
  let httpClient: HttpClient;

  beforeEach(async () => {
    httpServer = await main(4000);
    httpClient = new HttpClientFetchAdapter();
  });

  afterEach(async () => {
    await httpServer.stop();
  });

  describe("POST to /signup", () => {
    const endpoint = "http://localhost:4000/signup";
    let userData: unknown;

    beforeEach(() => {
      userData = {
        name: "John Doe",
        email: "john@example.com",
        password: "Test@146!",
      };
    });

    it("should signup a user through the controller", async () => {
      const response = await httpClient.request(HttpMethod.POST, endpoint, userData);
      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.data).toEqual({ id: expect.any(Number) });
    });

    it("should not signup a user with an existing email", async () => {
      await httpClient.request(HttpMethod.POST, endpoint, userData);
      const response = await httpClient.request(HttpMethod.POST, endpoint, userData);
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      expect(response.data).toEqual({ message: "User already exists" });
    });
  });
});
