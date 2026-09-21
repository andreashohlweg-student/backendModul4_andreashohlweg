import type { NextFunction, Request, Response } from "express";

import { getTweetById } from "../services/tweet.service.js";
import { TweetDeleteForbiddenError } from "../errors/tweetDeleteForbiddenError.js";
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
      return next(new TweetDeleteForbiddenError());
    }

    next();
  } catch (error) {
    next(error);
  }
};
