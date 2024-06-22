import multer from "multer";
import { Router } from "express";

import { doesVoterExists, ifVoterExists } from "../middlewares/existingUser.middleware";
import { getVoter, getVoters, registerVoter, deleteVoter } from "../controllers/voter.controller";

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

const router = Router();

router.get("/voters", getVoters);
router.post("/voter", upload.any(), ifVoterExists, registerVoter);
router.get("/voter/:aadhaarNumber", doesVoterExists, getVoter);
router.delete("/voter/:aadhaarNumber", doesVoterExists, deleteVoter);

export default router;
