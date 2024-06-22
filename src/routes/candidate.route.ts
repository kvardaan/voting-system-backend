import multer from "multer";
import { Router } from "express";

import { doesCandidateExists, ifCandidateExists } from "../middlewares/existingUser.middleware";
import { getCandidate, getCandidates, registerCandidate, deleteCandidate } from "../controllers/candidate.controller";

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } }); // 5 MB limit

const router = Router();

router.get("/candidates", getCandidates);
router.post("/candidate", upload.single("imageFile"), ifCandidateExists, registerCandidate);
router.get("/candidate/:_id", doesCandidateExists, getCandidate);
router.delete("/candidate/:_id", doesCandidateExists, deleteCandidate);

export default router;
