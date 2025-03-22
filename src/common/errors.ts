import { HttpException, HttpStatus } from '@nestjs/common';

export class CustomError extends HttpException {
  constructor(message: string, status: HttpStatus) {
    super({ error: message, statusCode: status }, status);
  }
}

export const Errors = {
  USER_NOT_FOUND: new CustomError('User not found', HttpStatus.NOT_FOUND),
  INVALID_CREDENTIALS: new CustomError(
    'Invalid credentials',
    HttpStatus.UNAUTHORIZED,
  ),
  EMAIL_ALREADY_EXISTS: new CustomError(
    'Email already exists',
    HttpStatus.CONFLICT,
  ),
  EMAIL_DOES_NOT_EXIST: new CustomError(
    'Account does not exist',
    HttpStatus.NOT_FOUND,
  ), // Changed from UNAUTHORIZED to NOT_FOUND
  EMAIL_IS_REQUIRED: new CustomError(
    'Organization email is required',
    HttpStatus.BAD_REQUEST,
  ), // Changed from NO_CONTENT to BAD_REQUEST
  TOKEN_IS_REQUIRED: new CustomError(
    'Token is required',
    HttpStatus.BAD_REQUEST,
  ), // Changed from NO_CONTENT to BAD_REQUEST
  INVALID_TOKEN: new CustomError(
    'Token does not exist',
    HttpStatus.UNAUTHORIZED,
  ),
  INVALID_PASSWORD: new CustomError(
    'Incorrect Password',
    HttpStatus.UNAUTHORIZED,
  ),
  TOKEN_EXPIRED: new CustomError('Token has expired', HttpStatus.UNAUTHORIZED),
  PASSWORD_IS_REQUIRED: new CustomError(
    'Password is required',
    HttpStatus.BAD_REQUEST,
  ), // Changed from NO_CONTENT to BAD_REQUEST
  ORGANISATION_IS_REQUIRED: new CustomError(
    'Organization name is required',
    HttpStatus.BAD_REQUEST,
  ), // Changed from NO_CONTENT to BAD_REQUEST
  FORBIDDEN_ACCESS: new CustomError('Access denied', HttpStatus.FORBIDDEN),
  INVALID_REFRESH_TOKEN: new CustomError(
    'Invalid refresh token',
    HttpStatus.UNAUTHORIZED,
  ),
  SEND_EMAIL_FAILED: new CustomError(
    'Unable to send email',
    HttpStatus.INTERNAL_SERVER_ERROR,
  ), // Changed from BAD_REQUEST to INTERNAL_SERVER_ERROR
};
