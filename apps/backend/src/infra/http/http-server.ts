import type { HttpMethod } from "./http-method";
import type { HttpCallback } from "./http-callback";

export interface HttpServer {
  start(port: number): Promise<void>;
  stop(): Promise<void>;
  register(method: HttpMethod, endpoint: string, callback: HttpCallback): void;
}
