import type { NextFunction, Request, Response } from "express";
import { JsonContentTypeRequiredError } from "../errors/jsonContentTypeRequiredError.js";

export const requireJsonContentType = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  if (!req.is(["application/json", "application/*+json"])) {
    throw new JsonContentTypeRequiredError();
  }

  next();
};
