import { InvalidPaginationError } from "../errors/invalidPaginationError.js";
import { InvalidTweetAuthorError } from "../errors/invalidTweetAuthorError.js";
import { PleaseSignInError } from "../errors/pleaseSignInError.js";
import { TweetTextRequiredError } from "../errors/tweetTextRequiredError.js";
import { TweetTextTooLongError } from "../errors/tweetTextTooLongError.js";
import { TweetTextTypeError } from "../errors/tweetTextTypeError.js";
import { isRecord } from "../utils/isRecord.js";
import { parseTweetId } from "../utils/parseTweetId.js";

import type { Request, Response } from "express";

import {
  getAllTweets,
  getTweetById,
  createTweet,
  deleteTweet,
  getTweetsByCreatedAt,
  getTweetsByAuthor,
  getTweetsPaginated,
  getTweetsByAuthorPaginated,
} from "../services/tweet.service.js";

const parseAuthor = (value: unknown): string | undefined => {
  if (value === undefined) {
    return undefined;
  }

  if (
    typeof value !== "string"
    || value.trim().length === 0
    || value.trim().length > 50
  ) {
    throw new InvalidTweetAuthorError();
  }

  return value.trim();
};

const parsePagination = (
  limitValue: unknown,
  offsetValue: unknown,
): { limit: number; offset: number } | undefined => {
  if (limitValue === undefined && offsetValue === undefined) {
    return undefined;
  }

  if (typeof limitValue !== "string" || typeof offsetValue !== "string") {
    throw new InvalidPaginationError();
  }

  if (!/^\d+$/.test(limitValue) || !/^\d+$/.test(offsetValue)) {
    throw new InvalidPaginationError();
  }

  const limit = Number(limitValue);
  const offset = Number(offsetValue);

  if (
    !Number.isInteger(limit)
    || limit < 1
    || limit > 100
    || !Number.isInteger(offset)
    || offset < 0
  ) {
    throw new InvalidPaginationError();
  }

  return { limit, offset };
};

export const getTweets = async (
  req: Request,
  res: Response,
) => {
  const author = parseAuthor(req.query.author);
  const pagination = parsePagination(req.query.limit, req.query.offset);

  if (pagination) {
    const tweets = author
      ? await getTweetsByAuthorPaginated(
        author,
        pagination.limit,
        pagination.offset,
      )
      : await getTweetsPaginated(pagination.limit, pagination.offset);

    res.status(200).json(tweets);
    return;
  }

  if (author) {
    const tweets = await getTweetsByAuthor(author);

    res.status(200).json(tweets);
    return;
  }

  const tweets = await getAllTweets();

  res.status(200).json(tweets);
};

export const getTweet = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const id = parseTweetId(req.params.id);

  const tweet = await getTweetById(id);

  res.status(200).json(tweet);
};

export const getTweetsByCreatedAtController = async (
  _req: Request,
  res: Response,
) => {
  const tweets = await getTweetsByCreatedAt();

  res.status(200).json(tweets);
};

export const createTweetController = async (
  req: Request<{}, {}, unknown>,
  res: Response,
) => {
  if (!isRecord(req.body)) {
    throw new TweetTextRequiredError();
  }

  const { text } = req.body;

  if (text === undefined) {
    throw new TweetTextRequiredError();
  }

  if (typeof text !== "string") {
    throw new TweetTextTypeError();
  }

  if (text.trim().length === 0) {
    throw new TweetTextRequiredError();
  }

  const normalizedText = text.trim();

  if (Array.from(normalizedText).length > 280) {
    throw new TweetTextTooLongError();
  }

  if (!req.user) {
    throw new PleaseSignInError();
  }

  const newTweet = await createTweet(normalizedText, req.user);

  res
    .location(`/tweets/${newTweet.id}`)
    .status(201)
    .json(newTweet);
};

export const deleteTweetController = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const id = parseTweetId(req.params.id);

  const deletedTweet = await deleteTweet(id);

  res.status(200).json(deletedTweet);
};
