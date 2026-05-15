import { Email, Name, Password } from "@domain/value-objects";

export class User {
  private readonly _id?: number;
  private readonly _name: Name;
  private readonly _email: Email;
  private readonly _password: Password;

  constructor(builder: UserBuilder) {
    this._id = builder.id;
    this._name = new Name(builder.name);
    this._email = new Email(builder.email);
    this._password =
      builder.id !== undefined ? new Password(builder.password) : Password.create(builder.password);
  }

  get id(): number | undefined {
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
  id?: number;
  name: string;
  email: string;
  password: string;
};
