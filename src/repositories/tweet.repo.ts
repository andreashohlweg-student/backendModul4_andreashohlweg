import { queryDatabase } from "../database.js";
import { UnexpectedDatabaseResultError } from "../errors/unexpectedDatabaseResultError.js";
import type { Tweet } from "../types/tweet.js";

export const findAllTweets = async (): Promise<Tweet[]> => {
  const result = await queryDatabase<Tweet>(`
    SELECT id, text, author
    FROM tweets
    ORDER BY id
  `);

  return result.rows;
};

export const insertTweet = async (
  text: string,
  author: string,
): Promise<Tweet> => {
  const result = await queryDatabase<Tweet>(`
    INSERT INTO tweets (text, author)
    VALUES ($1, $2)
    RETURNING id, text, author
  `, [text, author]);

  const tweet = result.rows[0];

  if (!tweet) {
    throw new UnexpectedDatabaseResultError();
  }

  return tweet;
};

export const findTweetById = async (
  id: number,
): Promise<Tweet | undefined> => {
  const result = await queryDatabase<Tweet>(
    `
      SELECT id, text, author
      FROM tweets
      WHERE id = $1
    `,
    [id],
  );

  return result.rows[0];
};

export const deleteTweetById = async (
  id: number,
): Promise<Tweet | undefined> => {
  const result = await queryDatabase<Tweet>(
    `
      DELETE FROM tweets
      WHERE id = $1
      RETURNING id, text, author
    `,
    [id],
  );

  return result.rows[0];
};

export const findTweetsByCreatedAt = async (): Promise<Tweet[]> => {
  const result = await queryDatabase<Tweet>(`
    SELECT id, text, author
    FROM tweets
    ORDER BY created_at DESC
  `);

  return result.rows;
};

export const findTweetsByAuthor = async (
  author: string,
): Promise<Tweet[]> => {
  const result = await queryDatabase<Tweet>(
    `
      SELECT id, text, author
      FROM tweets
      WHERE author = $1
      ORDER BY created_at DESC
    `,
    [author],
  );

  return result.rows;
};

export const findTweetsPaginated = async (
  limit: number,
  offset: number,
): Promise<Tweet[]> => {
  const result = await queryDatabase<Tweet>(
    `
      SELECT id, text, author
      FROM tweets
      ORDER BY created_at DESC
      LIMIT $1
      OFFSET $2
    `,
    [limit, offset],
  );

  return result.rows;
};

export const findTweetsByAuthorPaginated = async (
  author: string,
  limit: number,
  offset: number,
): Promise<Tweet[]> => {
  const result = await queryDatabase<Tweet>(
    `
      SELECT id, text, author
      FROM tweets
      WHERE author = $1
      ORDER BY created_at DESC
      LIMIT $2
      OFFSET $3
    `,
    [author, limit, offset],
  );

  return result.rows;
};
