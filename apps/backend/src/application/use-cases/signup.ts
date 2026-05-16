import { USERS_REPOSITORY_TOKEN } from "@application/repositories";
import { di } from "@cs-trade-platform/di";
import { DomainError } from "@cs-trade-platform/domain";
import { User } from "@domain/entities";

export type SignupInput = {
  name: string;
  email: string;
  password: string;
};

export type SignupOutput = {
  id: number;
};

export class Signup {
  private _usersrepository = di.inject(USERS_REPOSITORY_TOKEN);

  async execute(input: SignupInput): Promise<SignupOutput> {
    const existingUser = await this._usersrepository.getByEmail(input.email);
    if (existingUser) {
      throw new DomainError({ message: "User already exists" });
    }
    const user = new User({
      name: input.name,
      email: input.email,
      password: input.password,
    });
    const id = await this._usersrepository.save(user);
    return { id };
  }
}
