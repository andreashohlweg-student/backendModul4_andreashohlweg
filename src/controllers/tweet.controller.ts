import { TweetTextRequiredError } from "../errors/tweetTextRequiredError.js";
import { isRecord } from "../utils/isRecord.js";
import { parseTweetId } from "../utils/parseTweetId.js";

import type { Request, Response, NextFunction } from "express";

import {
  getAllTweets,
  getTweetById,
  createTweet,
  deleteTweet,
  getTweetsByCreatedAt,
  getTweetsByAuthor,
  getTweetsPaginated,
  getTweetsByAuthorPaginated
} from "../services/tweet.service.js";


export const getTweets = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const author = req.query.author;
    const limit = req.query.limit;
    const offset = req.query.offset;

    const parsedLimit =
      typeof limit === "string" ? Number(limit) : undefined;

    const parsedOffset =
      typeof offset === "string" ? Number(offset) : undefined;


    if (parsedLimit !== undefined && parsedOffset !== undefined) {
      const tweets =
        typeof author === "string"
          ? await getTweetsByAuthorPaginated(
              author,
              parsedLimit,
              parsedOffset
            )
          : await getTweetsPaginated(
              parsedLimit,
              parsedOffset
            );

      res.status(200).json(tweets);
      return;
    }

    if (typeof author === "string") {
      const tweets = await getTweetsByAuthor(author);

      res.status(200).json(tweets);
      return;
    }

    const tweets = await getAllTweets();

    res.status(200).json(tweets);
  } catch (error) {
    next(error);
  }
};

export const getTweet = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseTweetId(req.params.id);

    const tweet = await getTweetById(id);

    res.status(200).json(tweet);

  } catch(error) {
    next(error);
  }
  
};

export const getTweetsByCreatedAtController = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const tweets = await getTweetsByCreatedAt();

    res.status(200).json(tweets);
  } catch (error) {
    next(error);
  }
};

export const createTweetController = async (
  req: Request<{}, {}, unknown>,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!isRecord(req.body)) {
      return next(new TweetTextRequiredError());
    }

    const { text } = req.body;

    if (typeof text !== "string" || text.trim().length === 0) {
      return next(new TweetTextRequiredError());
    }

    const newTweet = await createTweet(
      text.trim(),
      req.user!,
    );

    res.status(201).json(newTweet);
  } catch (error) {
    next(error);
  }
};

export const deleteTweetController = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = parseTweetId(req.params.id);

    const deletedTweet = await deleteTweet(id);

    return res.status(200).json(deletedTweet);

  } catch (error) {
    next(error);
  }
};
