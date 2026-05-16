import type { InjectionToken } from "./injection-token";

class DI {
  private static instance: DI;
  private readonly container = new Map<InjectionToken<unknown>, unknown>();

  private constructor() {}

  static getInstance(): DI {
    if (!DI.instance) {
      DI.instance = new DI();
    }
    return DI.instance;
  }

  register<TValue>(token: InjectionToken<TValue>, value: TValue): void {
    this.container.set(token, value);
  }

  inject<TValue>(token: InjectionToken<TValue>): TValue {
    const value = this.container.get(token);
    if (value === undefined) {
      throw new Error(`Dependency not found for token: ${token.name}`);
    }
    return value as TValue;
  }

  clear(): void {
    this.container.clear();
  }
}

export const di = DI.getInstance();
export { DI };
