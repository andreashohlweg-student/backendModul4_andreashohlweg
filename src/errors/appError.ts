export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    options?: ErrorOptions,
  ) {
    super(message, options);
  }
}
