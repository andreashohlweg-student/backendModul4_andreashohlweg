import { AppError } from "./appError.js";

export class TodoTitleTypeError extends AppError {
  constructor() {
    super(400, "'title' muss ein String sein.");
  }
}
