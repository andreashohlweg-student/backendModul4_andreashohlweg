import type { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/appError.js";

export const errorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      error: error.message,
    });
  }

  return res.status(500).json({
    error: "Internal server error",
  });
};