export class ApiResponse {
  constructor(statusCode, message = null, data = null) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }
}
