import type { Request, Response } from "express";
import type {
  GreetResponse,
  HealthResponse,
} from "../types/common.js";
import { GreetNameRequiredError } from "../errors/greetNameRequiredError.js";

export const echo = (
  _req: Request,
  res: Response,
) => {
  res.send("Echo");
};

export const hello = (
  _req: Request,
  res: Response<HealthResponse>,
) => {
  res.status(200).json({
    success: true,
    message: "Syntax!",
    timestamp: new Date().toISOString(),
  });
};

export const health = (
  _req: Request,
  res: Response<HealthResponse>,
) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
};

export const greetByName = (
  req: Request<{ name: string }>,
  res: Response<GreetResponse>,
) => {
  const name = req.params.name.trim();
  const lang = req.query.lang;

  if (name.length === 0) {
    throw new GreetNameRequiredError();
  }

  const message = lang === "en"
    ? `Hello ${name}`
    : `Hallo ${name}`;

  res.json({ message });
};

export const greetByQuery = (
  req: Request,
  res: Response<GreetResponse>,
) => {
  const name = req.query.name;
  const lang = req.query.lang;

  if (typeof name !== "string" || name.trim().length === 0) {
    throw new GreetNameRequiredError();
  }

  const message = lang === "en"
    ? `Hello ${name.trim()}`
    : `Hallo ${name.trim()}`;

  res.json({ message });
};
