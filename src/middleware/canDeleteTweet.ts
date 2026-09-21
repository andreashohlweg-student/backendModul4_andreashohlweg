import type { NextFunction, Request, Response } from "express";

import { getTweetById } from "../services/tweet.service.js";
import { AppError } from "../errors/appError.js";
import { parseTweetId } from "../utils/parseTweetId.js";

export const canDeleteTweet = (
  req: Request<{ id: string }>,
  _res: Response,
  next: NextFunction,
) => {
  try {
    const id = parseTweetId(req.params.id);

    const tweet = getTweetById(id);

    if (tweet.author !== req.user) {
      return next(
        new AppError(403, "You can only delete your own tweets"),
      );
    }

    next();
  } catch (error) {
    next(error);
  }
};
