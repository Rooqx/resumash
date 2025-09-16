// middleware/errorHandler.ts
import type { Request, Response, NextFunction } from "express";
import { ResponseHelper } from "../utils/responseHelper";

/**
 * Custom Error class for application-specific errors
 * Extends native Error class with status code and additional properties
 */

export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = 500,
    isOperational: boolean = true
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    // Maintains proper stack trace for where our error was thrown
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Custom Error class for validation failures
 * Contains detailed field-level validation errors
 */
export class ValidationError extends AppError {
  public errors: any[];

  constructor(errors: any[], message: string = "Validation failed") {
    super(message, 422);
    this.errors = errors;
  }
}

/**
 * Custom Error class for database operations failures
 */
export class DatabaseError extends AppError {
  constructor(message: string = "Database operation failed") {
    super(message, 500);
  }
}

/**
 * Custom Error class for authentication failures
 */
export class AuthenticationError extends AppError {
  constructor(message: string = "Authentication failed") {
    super(message, 401);
  }
}

/**
 * Custom Error class for authorization failures
 */
export class AuthorizationError extends AppError {
  constructor(message: string = "Access forbidden") {
    super(message, 403);
  }
}

/**
 * Global error handling middleware for Express applications
 * Catches all errors and sends standardized JSON responses
 * Differentiates between operational errors and programming errors
 */
export const errorHandler = (
  error: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Log error details for debugging and monitoring
  logError(error, req);

  // Handle specific error types with appropriate responses
  if (error instanceof ValidationError) {
    handleValidationError(error, res);
  } else if (error instanceof AuthenticationError) {
    handleAuthenticationError(error, res);
  } else if (error instanceof AuthorizationError) {
    handleAuthorizationError(error, res);
  } else if (error instanceof DatabaseError) {
    handleDatabaseError(error, res);
  } else if (error instanceof AppError) {
    handleAppError(error, res);
  } else {
    handleUnknownError(error, res);
  }
};

/**
 * Logs error details with request information
 * @param error - The error object
 * @param req - Express Request object for context
 */
const logError = (error: Error, req: Request): void => {
  console.error("Error occurred:", {
    timestamp: new Date().toISOString(),
    message: error.message,
    stack: error.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    // Don't log sensitive headers
    headers: {
      "user-agent": req.get("user-agent"),
      "content-type": req.get("content-type"),
    },
  });
};

/**
 * Handles validation errors with detailed field information
 */
const handleValidationError = (error: ValidationError, res: Response): void => {
  ResponseHelper.error(
    res,
    error.message,
    error.statusCode,
    process.env.NODE_ENV === "development"
      ? { errors: error.errors }
      : undefined
  );
};

/**
 * Handles authentication errors (401 Unauthorized)
 */
const handleAuthenticationError = (
  error: AuthenticationError,
  res: Response
): void => {
  ResponseHelper.error(res, error.message, error.statusCode);
};

/**
 * Handles authorization errors (403 Forbidden)
 */
const handleAuthorizationError = (
  error: AuthorizationError,
  res: Response
): void => {
  ResponseHelper.error(res, error.message, error.statusCode);
};

/**
 * Handles database errors with appropriate messaging
 */
const handleDatabaseError = (error: DatabaseError, res: Response): void => {
  const message =
    process.env.NODE_ENV === "production"
      ? "Database operation failed"
      : error.message;

  ResponseHelper.error(res, message, error.statusCode);
};

/**
 * Handles known application errors (operational errors)
 */
const handleAppError = (error: AppError, res: Response): void => {
  ResponseHelper.error(res, error.message, error.statusCode);
};

/**
 * Handles unknown/unexpected errors (programming errors, third-party lib errors)
 * Prevents leaking sensitive information in production
 */
const handleUnknownError = (error: Error, res: Response): void => {
  const message =
    process.env.NODE_ENV === "production"
      ? "An unexpected error occurred. Please try again later."
      : error.message;

  const statusCode = 500;

  ResponseHelper.error(
    res,
    message,
    statusCode,
    process.env.NODE_ENV === "development" ? { stack: error.stack } : undefined
  );
};

/**
 * Async error wrapper middleware to catch errors in async routes
 * Eliminates the need for try-catch blocks in every async controller
 */
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction): Promise<void> => {
    return Promise.resolve(fn(req, res, next)).catch(next);
  };
};
