import type { HttpMethod } from "./http-method";

export interface HttpClient {
  request(method: HttpMethod, endpoint: string, body?: any): Promise<any>;
}
