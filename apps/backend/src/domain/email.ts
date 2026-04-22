export class Email {
  constructor(readonly value: string) {
    this.value = value.trim().toLocaleLowerCase();
    this.validate();
  }

  private validate(): void {
    if (!this.value) throw new Error("Email cannot be empty");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.value)) throw new Error("Invalid email format");
  }
}
