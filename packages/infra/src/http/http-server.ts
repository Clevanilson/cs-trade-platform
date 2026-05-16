import { InjectionToken } from "@cs-trade-platform/di";
import type { HttpCallback } from "./http-callback";
import type { HttpMethod } from "./http-method";

export interface HttpServer {
  start(port: number): Promise<void>;
  stop(): Promise<void>;
  register(method: HttpMethod, endpoint: string, callback: HttpCallback): void;
}

export const HTTP_SERVER_TOKEN = new InjectionToken<HttpServer>("HttpServer");
