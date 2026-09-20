import { AppError } from "./appError.js";

export class TodoTitleMissingError extends AppError {
  constructor() {
    super(400, "Das Feld 'title' fehlt.");
  }
}
