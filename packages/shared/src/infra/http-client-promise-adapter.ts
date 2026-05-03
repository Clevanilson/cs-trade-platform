import type { HttpClient } from "./http-client";
import type { HttpMethod } from "./http-method";
import type { HttpResponse } from "./http-response";

export class HttpClientPromiseAdapter implements HttpClient {
  async request<TData = unknown>(
    method: HttpMethod,
    endpoint: string,
    body?: unknown,
  ): Promise<HttpResponse<TData>> {
    const response = await fetch(endpoint, {
      method,
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await response.json();
    return { status: response.status, data };
  }
}
