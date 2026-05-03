import { type HttpMethod, HttpStatus } from "@cs-trade-platform/shared";
import type { Server } from "bun";
import type { HttpCallback } from "./http-callback";
import type { HttpServer } from "./http-server";

type Route = {
  method: HttpMethod;
  regex: RegExp;
  paramNames: string[];
  callback: HttpCallback;
};

export class BunHttpServer implements HttpServer {
  private routes: Route[] = [];
  private server?: Server<undefined>;

  register(method: HttpMethod, endpoint: string, callback: HttpCallback): void {
    const paramNames: string[] = [];
    const regexPath = endpoint
      .replace(/:([^/]+)/g, (_, paramName) => {
        paramNames.push(paramName);
        return "([^/]+)";
      })
      .replace(/\//g, "\\/");
    this.routes.push({
      method,
      regex: new RegExp(`^${regexPath}$`),
      paramNames,
      callback,
    });
  }

  async stop(): Promise<void> {
    this.server?.stop();
  }

  async start(port: number): Promise<void> {
    this.server = Bun.serve({
      port,
      fetch: (request) => this.handleRequest(request),
    });
  }

  private async handleRequest(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const method = request.method.toUpperCase() as HttpMethod;
    const pathname = url.pathname;
    const route = this.findRoute(method, pathname);
    if (!route) {
      return new Response(null, { status: HttpStatus.NOT_FOUND });
    }
    const params = this.getParams(route, pathname);
    const query = this.getQuery(url);
    const output = await route.callback({ params, query });
    return Response.json(output.data || null, { status: output.status });
  }

  private findRoute(method: HttpMethod, pathname: string): Route | undefined {
    return this.routes.find((r) => r.method === method && r.regex.test(pathname));
  }

  private getParams(route: Route, pathname: string): Record<string, string> {
    const match = pathname.match(route.regex);
    const params: Record<string, string> = {};
    if (!match) return params;
    route.paramNames.forEach((name, index) => {
      params[name] = match[index + 1];
    });
    return params;
  }

  private getQuery(url: URL): Record<string, string> {
    const query: Record<string, string> = {};
    url.searchParams.forEach((value, key) => {
      query[key] = value;
    });
    return query;
  }
}
