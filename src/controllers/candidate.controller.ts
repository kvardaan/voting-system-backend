import { configDotenv } from "dotenv";
import { Request, Response } from "express";

import { Candidate } from "../db/candidate.dbSchema";
import { HttpStatusCode } from "../utils/httpStatusCodes";
import { deleteCandidateImage, saveCandidateSymbol } from "../helpers/imageManage.helper";
import { generateUniqueID } from "../helpers/uniqueID.helper";

configDotenv();
const { CANDIDATES_PATH } = process.env;

export const getCandidate = async (req: Request, res: Response) => {
	try {
		const { _id } = req.params;
		const candidate = await Candidate.findOne({ _id });
		res.status(HttpStatusCode.OK).json(candidate);
	} catch (error) {
		res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: `Error: ${error}` });
	}
};

export const getCandidates = async (req: Request, res: Response) => {
	try {
		const candidates = await Candidate.find();
		res.status(HttpStatusCode.OK).json(candidates);
	} catch (error) {
		res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: `Error: ${error}` });
	}
};

export const registerCandidate = async (req: Request, res: Response) => {
	const { candidateName, partyName } = req.body;

	const imageFile: any = req.file;
	try {
		const candidateID = await generateUniqueID();
		const symbolURL = await saveCandidateSymbol(imageFile, CANDIDATES_PATH, candidateID);

		const newCandidate = new Candidate({
			candidateName,
			candidateID,
			partyName,
			symbolURL,
		});

		await newCandidate.save();

		return res.status(HttpStatusCode.CREATED).json({ message: "Candidate registered successfully!" });
	} catch (error) {
		console.log(error);

		res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: `Error: ${error}` });
	}
};

export const deleteCandidate = async (req: Request, res: Response) => {
	try {
		const { _id } = req.params;
		const candidate = await Candidate.findOne({ _id });
		if (candidate) {
			await deleteCandidateImage(candidate.candidateID, CANDIDATES_PATH);

			const candidateDeleteStatus = await Candidate.deleteOne({ _id });

			if (candidateDeleteStatus.deletedCount) {
				res.status(HttpStatusCode.OK).json({ message: "Candidate deleted successfully!" });
			} else {
				res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Candidate could not be deleted!" });
			}
		} else {
			res.status(HttpStatusCode.NOT_FOUND).json({ message: "Candidate not found." });
		}
	} catch (error: any) {
		res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: `Error: ${error.message}` });
	}
};
