import type { NextFunction, Request, Response } from "express";
import { getTweetById } from "../services/tweet.service.js";

export const canDeleteTweet = (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) => {
  const id = Number(req.params.id);

  const tweet = getTweetById(id);

  if (!tweet) {
    return res.status(404).json({
      error: "Tweet not found",
    });
  }

  if (tweet.author !== req.user) {
    return res.status(403).json({
      error: "You can only delete your own tweets",
    });
  }

  next();
};