export class Password {
  constructor(readonly value: string) {}

  static create(plainText: string): Password {
    Password.validateLength(plainText);
    Password.validateSequence(plainText);
    const hash = Bun.password.hashSync(plainText, { algorithm: "argon2id" });
    return new Password(hash);
  }

  compare(plainText: string): boolean {
    return Bun.password.verifySync(plainText, this.value);
  }

  private static validateLength(value: string): void {
    const minLength = 8;
    if (value.length < minLength) {
      throw new Error(`Password must have at least ${minLength} characters`);
    }
    const maxLength = 64;
    if (value.length > maxLength) {
      throw new Error(`Password cannot have more than ${maxLength} characters`);
    }
  }

  private static validateSequence(value: string): void {
    for (let i = 0; i < value.length - 2; i++) {
      const char1 = value.charCodeAt(i);
      const char2 = value.charCodeAt(i + 1);
      const char3 = value.charCodeAt(i + 2);
      if (char2 === char1 + 1 && char3 === char2 + 1) {
        throw new Error("Password cannot contain common sequences");
      }
      if (char2 === char1 - 1 && char3 === char2 - 1) {
        throw new Error("Password cannot contain common sequences");
      }
    }
  }
}
