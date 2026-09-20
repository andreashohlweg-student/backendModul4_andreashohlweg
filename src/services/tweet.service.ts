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
  return tweets;
};

export const getTweetById = (id: number): Tweet | undefined => {
  return tweets.find((tweet) => tweet.id === id);
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
export const deleteTweet = (id: number): Tweet | undefined => {
    const index = tweets.findIndex((tweet) => tweet.id === id);

    if (index === -1) {
        return undefined;
    }

    const deletedTweet = tweets.splice(index, 1)[0];

    return deletedTweet;
};