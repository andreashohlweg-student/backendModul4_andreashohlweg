import type { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/appError.js";

type RequestBodyError = {
  status?: number;
  type?: string;
};

const isRequestBodyError = (
  error: unknown,
): error is RequestBodyError => {
  return typeof error === "object" && error !== null;
};

export const errorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (res.headersSent) {
    return next(error);
  }

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      error: error.message,
    });
  }

  if (isRequestBodyError(error)) {
    if (error.status === 400 && error.type === "entity.parse.failed") {
      return res.status(400).json({
        error: "Invalid JSON",
      });
    }

    if (error.status === 413 && error.type === "entity.too.large") {
      return res.status(413).json({
        error: "Request body too large",
      });
    }
  }

  console.error(error);

  return res.status(500).json({
    error: "Internal server error",
  });
};
