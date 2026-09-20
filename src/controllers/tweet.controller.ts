import type { Request, Response, NextFunction } from "express";
import type { CreateTweetBody } from "../types/tweetRequest.js";

import {
  getAllTweets,
  getTweetById,
  createTweet,
  deleteTweet
} from "../services/tweet.service.js";


export const getTweets = (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const tweets = getAllTweets();

    res.status(200).json(tweets);

  } catch(error) {
    next(error);
  }
};

export const getTweet = (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);

    const tweet = getTweetById(id);

    if (!tweet) {
      return res.status(404).json({
        error: "Tweet not found",
      });
    }

    res.status(200).json(tweet);
  } catch(error) {
    next(error);
  }
  
};

export const createTweetController = (
  req: Request<{}, {}, CreateTweetBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { text } = req.body;

    if (typeof text !== "string" || text.trim().length === 0) {
      return res.status(400).json({
        error: "Tweet text is required",
      });
    }

    const newTweet = createTweet(
      text.trim(),
      req.user!,
    );

    res.status(201).json(newTweet);
  } catch (error) {
    next(error);
  }
};

export const deleteTweetController = (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = Number(req.params.id);

    const deletedTweet = deleteTweet(id);

    if (!deletedTweet) {
      return res.status(404).json({
        error: "Tweet not found",
      });
    }

    return res.status(200).json(deletedTweet);
  } catch (error) {
    next(error);
  }
};