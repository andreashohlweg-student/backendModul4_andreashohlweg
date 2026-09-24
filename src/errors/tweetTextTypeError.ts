import { AppError } from "./appError.js";

export class TweetTextTypeError extends AppError {
  constructor() {
    super(400, "Text must be a string");
  }
}
