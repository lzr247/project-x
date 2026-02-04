import { NextFunction, Request, Response } from "express";

// Custom Error class
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// 404 Not Found Handler
export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  return res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found.`,
  });
};

// Global Error Handler
export const errorHandler = (err: Error | AppError, req: Request, res: Response, next: NextFunction) => {
  // If our custom error
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // Prisma error
  if (err.name === "PrismaClientKnownRequestError") {
    return res.status(400).json({
      success: false,
      message: "Database error.",
    });
  }

  // Generic server error
  return res.status(500).json({
    success: false,
    message: "Internal server error.",
  });
};
