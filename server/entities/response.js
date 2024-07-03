export class ApiResponse {
  constructor(statusCode, message = null, data = null, exception = null) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.exception = exception;
  }
}