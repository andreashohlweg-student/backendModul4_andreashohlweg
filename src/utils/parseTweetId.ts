import { InvalidTweetIdError } from "../errors/invalidTweetIdError.js";

export const parseTweetId = (value: string): number => {
  if (!/^\d+$/.test(value)) {
    throw new InvalidTweetIdError();
  }

  const id = Number(value);

  if (!Number.isSafeInteger(id) || id <= 0) {
    throw new InvalidTweetIdError();
  }

  return id;
};
