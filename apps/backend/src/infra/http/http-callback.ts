import type { HttpResponse } from "./http-response";

export type HttpCallbackInput = {
  params: Record<string, unknown>;
  query: Record<string, unknown>;
};

export type HttpCallback = (input: HttpCallbackInput) => Promise<HttpResponse>;
