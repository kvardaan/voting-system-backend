import { Request, Response, NextFunction } from "express";

import { Voter } from "../db/voter.dbSchema";
import { Candidate } from "../db/candidate.dbSchema";
import { HttpStatusCode } from "../utils/httpStatusCodes";

// checks if the voter exists
export const doesVoterExists = async (req: Request, res: Response, next: NextFunction) => {
	const { aadhaarNumber } = req.params;

	if (!aadhaarNumber)
		return res.status(HttpStatusCode.BAD_REQUEST).send({
			message: "Aadhaar Number missing!",
		});

	const voter = await Voter.findOne({
		aadhaarNumber: aadhaarNumber,
	});
	if (!voter)
		return res.status(HttpStatusCode.NOT_FOUND).json({
			message: `Voter with Aadhaar Number (${aadhaarNumber}) not found!`,
		});

	next();
};

// checks if the voter already exists
export const ifVoterExists = async (req: Request, res: Response, next: NextFunction) => {
	const { aadhaarNumber } = req.body;

	if (!aadhaarNumber)
		return res.status(HttpStatusCode.BAD_REQUEST).json({
			message: "Aadhaar Number missing!",
		});

	const voter = await Voter.findOne({
		aadhaarNumber: aadhaarNumber,
	});
	if (voter)
		return res.status(HttpStatusCode.CONFLICT).json({
			message: `Voter with Aadhaar Number (${aadhaarNumber}) is already registered!`,
		});

	next();
};

// checks if the candidate exists
export const ifCandidateExists = async (req: Request, res: Response, next: NextFunction) => {
	const { candidateName, partyName } = req.body;

	if (candidateName === null || candidateName === undefined || partyName === null || partyName === undefined)
		return res.status(HttpStatusCode.BAD_REQUEST).send({
			message: "Missing Fields",
		});

	const candidate = await Candidate.findOne({
		candidateName: candidateName,
		partyName: partyName,
	});

	if (candidate)
		return res.status(HttpStatusCode.CONFLICT).json({
			message: `Candidate with Name (${candidateName}) & Party (${partyName}) is already registered!`,
		});

	next();
};

// checks if the candidate already exists
export const doesCandidateExists = async (req: Request, res: Response, next: NextFunction) => {
	const { _id } = req.params;
	if (!_id)
		return res.status(HttpStatusCode.BAD_REQUEST).send({
			message: "Missing Fields",
		});

	const candidate = await Candidate.findOne({
		_id,
	});
	if (!candidate)
		return res.status(HttpStatusCode.NOT_FOUND).json({
			message: `Candidate not found!`,
		});

	next();
};
