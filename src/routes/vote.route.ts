import multer from "multer";
import { Router } from "express";

import { getVotes, submitVote } from "../controllers/vote.controller";

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

const router = Router();

router.post("/submit-vote", upload.any(), submitVote);
router.get("/votes", getVotes);

export default router;
