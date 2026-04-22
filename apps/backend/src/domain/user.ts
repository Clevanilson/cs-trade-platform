import { Email } from "./email";
import { Name } from "./name";
import { Password } from "./password";

export class User {
  private readonly _id?: string;
  private readonly _name: Name;
  private readonly _email: Email;
  private readonly _password: Password;

  constructor(builder: UserBuilder) {
    this._id = builder.id;
    this._name = new Name(builder.name);
    this._email = new Email(builder.email);
    this._password = builder.id
      ? new Password(builder.password)
      : Password.create(builder.password);
  }

  get id(): string | undefined {
    return this._id;
  }

  get name(): string {
    return this._name.value;
  }

  get email(): string {
    return this._email.value;
  }

  get password(): string {
    return this._password.value;
  }

  comparePassword(password: string): boolean {
    return this._password.compare(password);
  }
}

export type UserBuilder = {
  id?: string;
  name: string;
  email: string;
  password: string;
};
