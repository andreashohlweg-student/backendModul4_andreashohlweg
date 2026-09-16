export type Tweet = {
  id: number;
  text: string;
  author: string;
};

export type CreateTweetBody = {
  text: string;
};

export type DeleteTweetParams = {
  id: string;
};

export type DeleteTweetResponse = {
  success: boolean;
};