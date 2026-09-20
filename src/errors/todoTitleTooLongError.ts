import { AppError } from "./appError.js";

export class TodoTitleTooLongError extends AppError {
  constructor() {
    super(400, "'title' darf maximal 100 Zeichen lang sein.");
  }
}
