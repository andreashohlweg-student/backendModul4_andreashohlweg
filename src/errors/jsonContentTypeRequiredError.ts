import { AppError } from "./appError.js";

export class JsonContentTypeRequiredError extends AppError {
  constructor() {
    super(415, "Content-Type must be application/json");
  }
}
