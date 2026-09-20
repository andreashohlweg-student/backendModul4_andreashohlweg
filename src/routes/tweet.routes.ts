import { Router } from "express";

import {
  getTweets,
  getTweet,
  createTweetController,
  deleteTweetController
} from "../controllers/tweet.controller.js";

import { checkAuth } from "../middleware/checkAuth.js";
import { canDeleteTweet } from "../middleware/canDeleteTweet.js";

const router = Router();

router.get("/", getTweets);
router.get("/:id", getTweet);

router.post("/", checkAuth, createTweetController);

router.delete("/:id", checkAuth, canDeleteTweet, deleteTweetController);
export default router;