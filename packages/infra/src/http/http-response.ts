import type { HttpStatus } from "./http-status";

export type HttpResponse<TData = unknown> = {
  status: HttpStatus | number;
  data?: TData;
};
