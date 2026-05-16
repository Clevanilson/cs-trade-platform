import { Signup, type SignupInput } from "@application/use-cases";
import { di } from "@cs-trade-platform/di";
import { HTTP_SERVER_TOKEN, HttpMethod, HttpStatus } from "@cs-trade-platform/infra";

export class UsersController {
  private readonly httpServer = di.inject(HTTP_SERVER_TOKEN);

  constructor() {
    this.httpServer.register(HttpMethod.POST, "/signup", async ({ body }) => {
      const signup = new Signup();
      const output = await signup.execute(body as SignupInput);
      return { status: HttpStatus.CREATED, data: output };
    });
  }
}
