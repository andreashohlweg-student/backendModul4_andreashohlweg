import { TweetNotFoundError } from "../errors/tweetNotFoundError.js";
import type { Tweet } from "../types/tweet.js";
import { findAllTweets, insertTweet, findTweetById, deleteTweetById, findTweetsByCreatedAt, findTweetsByAuthor, findTweetsPaginated, findTweetsByAuthorPaginated } from "../repositories/tweet.repo.js";


export const getAllTweets = async (): Promise<Tweet[]> => {
  return findAllTweets();
};

export const getTweetById = async (id: number): Promise<Tweet> => {
  const tweet = await findTweetById(id);

  if (!tweet) {
    throw new TweetNotFoundError();
  }

  return tweet;
};


export const getTweetsByCreatedAt = async (): Promise<Tweet[]> => {
  return findTweetsByCreatedAt();
};

export const getTweetsByAuthor = async (
  author: string,
): Promise<Tweet[]> => {
  return findTweetsByAuthor(author);
};

export const getTweetsPaginated = async (
  limit: number,
  offset: number,
): Promise<Tweet[]> => {
  return findTweetsPaginated(limit, offset);
};

export const getTweetsByAuthorPaginated = async (
  author: string,
  limit: number,
  offset: number,
): Promise<Tweet[]> => {
  return findTweetsByAuthorPaginated(author, limit, offset);
};

export const createTweet = (
  text: string,
  author: string,
): Promise<Tweet> => {
  return insertTweet(text, author);
};

export const deleteTweet = async (id: number): Promise<Tweet> => {
  const deletedTweet = await deleteTweetById(id);

  if (!deletedTweet) {
    throw new TweetNotFoundError();
  }

  return deletedTweet;
};
