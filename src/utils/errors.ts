export class AppError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
    this.name = 'AppError';
  }
}

export function toMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  return String(err);
}
