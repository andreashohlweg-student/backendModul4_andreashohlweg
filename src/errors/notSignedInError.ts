import { AppError } from "./appError.js";

export class NotSignedInError extends AppError {
  constructor() {
    super(401, "Not signed in");
  }
}