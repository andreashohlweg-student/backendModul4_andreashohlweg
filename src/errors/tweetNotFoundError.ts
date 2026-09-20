import { AppError } from "./appError.js";

export class TweetNotFoundError extends AppError {
  constructor() {
    super(404, "Tweet not found");
  }
}