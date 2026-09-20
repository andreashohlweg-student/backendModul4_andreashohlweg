import { TweetNotFoundError } from "../errors/tweetNotFoundError.js";

import type { Tweet } from "../types/tweet.js";

const tweets: Tweet[] = [
  {
    id: 1,
    text: "Hello Twitter!",
    author: "alice",
  },
  {
    id: 2,
    text: "Mein zweiter Tweet",
    author: "bob",
  },
];

export const getAllTweets = (): Tweet[] => {
  //throw new Error("Test error");
  return tweets;
};

export const getTweetById = (id: number): Tweet => {
  const tweet = tweets.find((tweet) => tweet.id === id);

  if (!tweet) {
    throw new TweetNotFoundError();
  }

  return tweet;
};

export const createTweet = (
    text: string,
    author: string,
): Tweet => {
    const newTweet: Tweet = {
        id: Math.max(0, ...tweets.map((tweet) => tweet.id)) + 1,
        text,
        author,
    };

    tweets.push(newTweet);

    return newTweet;
};

export const deleteTweet = (id: number): Tweet => {
    const index = tweets.findIndex((tweet) => tweet.id === id);

    if (index === -1) {
        throw new TweetNotFoundError();
    }

    const deletedTweet = tweets.splice(index, 1)[0]!;

    return deletedTweet;
};