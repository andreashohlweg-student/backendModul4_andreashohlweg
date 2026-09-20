import { Router } from "express";

import {
  echo,
  greetByName,
  greetByQuery,
  health,
  hello,
} from "../controllers/general.controller.js";

const router = Router();

router.get("/echo", echo);
router.get("/hello", hello);
router.get("/health", health);
router.get("/greet/:name", greetByName);
router.get("/greet", greetByQuery);

export default router;
