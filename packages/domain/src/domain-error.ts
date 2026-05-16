export class DomainError extends Error {
  constructor(params?: { message?: string }) {
    super(params?.message ?? "Invalid data");
    this.name = "DomainError";
  }
}
