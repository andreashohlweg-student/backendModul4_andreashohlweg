import { Router } from "express";

import {
  getUsers,
  getUser,
} from "../controllers/user.controller.js";

const router = Router();

router.get("/", getUsers);
router.get("/:username", getUser);

export default router;