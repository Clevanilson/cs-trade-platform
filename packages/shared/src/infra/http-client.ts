import type { HttpMethod } from "./http-method";
import type { HttpResponse } from "./http-response";

export interface HttpClient {
  request<TData = unknown>(
    method: HttpMethod,
    endpoint: string,
    body?: unknown,
  ): Promise<HttpResponse<TData>>;
}
