import type { NextFunction, Request, Response } from "express";

import { getTweetById } from "../services/tweet.service.js";
import { TweetDeleteForbiddenError } from "../errors/tweetDeleteForbiddenError.js";
import { parseTweetId } from "../utils/parseTweetId.js";

export const canDeleteTweet = async (
  req: Request<{ id: string }>,
  _res: Response,
  next: NextFunction,
) => {
  const id = parseTweetId(req.params.id);

  const tweet = await getTweetById(id);

  if (tweet.author !== req.user) {
    throw new TweetDeleteForbiddenError();
  }

  next();
};
