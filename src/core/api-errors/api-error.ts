export class ApiError extends Error {
  code: string;
  message: string;
  status: number;

  constructor(status: number, code: string, message: string) {
    super();
    this.code = code;
    this.status = status;
    this.message = message;
  }
}
