
import type { Response } from "express";

interface SuccessResponse<T = any> {
  success: true;
  message: string;
  data: T | null;
  timestamp: string;
}

interface ErrorResponse {
  success: false;
  message: string;
  timestamp: string;
  details?: any;
}

interface ValidationError {
  field: string;
  message: string;
}

export class ResponseHelper {
  static success<T>(
    res: Response,
    data: T | null = null,
    message: string = "Success",
    statusCode: number = 200
  ): Response {
    const response: SuccessResponse<T> = {
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
    };

    return res.status(statusCode).json(response);
  }

  static error(
    res: Response,
    message: string = "Internal server error",
    statusCode: number = 500,
    details: any = null
  ): Response {
    const response: ErrorResponse = {
      success: false,
      message,
      timestamp: new Date().toISOString(),
    };

    if (details && process.env.NODE_ENV === "development") {
      response.details = details;
    }

    return res.status(statusCode).json(response);
  }

  static created<T>(
    res: Response,
    data: T | null = null,
    message: string = "Resource created successfully"
  ): Response {
    return this.success(res, data, message, 201);
  }

  static notFound(
    res: Response,
    message: string = "Resource not found"
  ): Response {
    return this.error(res, message, 404);
  }

  static unauthorized(
    res: Response,
    message: string = "Unauthorized access"
  ): Response {
    return this.error(res, message, 401);
  }

  static forbidden(res: Response, message: string = "Forbidden"): Response {
    return this.error(res, message, 403);
  }

  static badRequest(
    res: Response,
    message: string = "Bad request",
    details: any = null
  ): Response {
    return this.error(res, message, 400, details);
  }

  static validationError(
    res: Response,
    errors: ValidationError[],
    message: string = "Validation failed"
  ): Response {
    return this.error(res, message, 422, { errors });
  }
}
