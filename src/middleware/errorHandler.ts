import type { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/appError.js";

type RequestBodyError = {
  status?: number;
  type?: string;
};

const clientErrorMessages: Record<number, string> = {
  400: "Bad request",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Not found",
  413: "Request body too large",
  415: "Unsupported media type",
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
    if (error.statusCode >= 500) {
      console.error(error);
    }

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

    if (
      typeof error.status === "number"
      && error.status >= 400
      && error.status < 500
    ) {
      return res.status(error.status).json({
        error: clientErrorMessages[error.status] ?? "Client request error",
      });
    }
  }

  console.error(error);

  return res.status(500).json({
    error: "Internal server error",
  });
};
