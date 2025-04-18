import { HttpException, HttpStatus } from '@nestjs/common';

export class ApiError extends HttpException {
  constructor(code: string, message: any, status = HttpStatus.BAD_REQUEST) {
    super({ code, message }, status);
  }
}
