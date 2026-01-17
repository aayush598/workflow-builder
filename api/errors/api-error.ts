export abstract class ApiError extends Error {
  public readonly statusCode: number;
  public readonly code: string;

  protected constructor(
    message: string,
    statusCode: number,
    code: string
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.name = this.constructor.name;
  }
}
