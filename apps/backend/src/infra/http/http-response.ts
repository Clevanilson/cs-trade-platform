import type { HttpStatus } from "./http-status";

export interface HttpResponse {
  data?: unknown;
  status: HttpStatus;
}
