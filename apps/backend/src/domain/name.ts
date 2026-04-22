export class Name {
  constructor(readonly value: string) {
    this.value = this.value.trim();
    this.validate();
  }

  private validate(): void {
    this.validateLength();
    this.validateFormat();
  }

  private validateLength(): void {
    const maxLength = 64;
    if (this.value.length > maxLength) {
      throw new Error(`Name cannot have more than ${maxLength} characters`);
    }
    if (!this.value) {
      throw new Error("Name cannot be empty");
    }
  }

  private validateFormat(): void {
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(this.value)) {
      throw new Error("Name cannot have numbers or special characters");
    }
  }
}
