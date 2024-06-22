import { Request, Response, Router } from "express";

import voterRoutes from "./voter.route";
import candidateRoutes from "./candidate.route";
import voteRoutes from "./vote.route";

const router = Router();

router.use(voteRoutes);
router.use(voterRoutes);
router.use(candidateRoutes);

export default router;
