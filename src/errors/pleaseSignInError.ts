import { AppError } from "./appError.js";

export class PleaseSignInError extends AppError {
  constructor() {
    super(401, "Please sign in");
  }
}