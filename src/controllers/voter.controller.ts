import { configDotenv } from "dotenv";
import { Request, Response } from "express";

import { Voter } from "../db/voter.dbSchema";
import { HttpStatusCode } from "../utils/httpStatusCodes";
import { generateUniqueID } from "../helpers/uniqueID.helper";
import { deleteVoterImage, saveVoterImage } from "../helpers/imageManage.helper";

configDotenv();
const { VOTERS_PATH } = process.env;

export const getVoter = async (req: Request, res: Response) => {
	try {
		const { aadhaarNumber } = req.params;
		const voter = await Voter.findOne({ aadhaarNumber });
		res.status(HttpStatusCode.OK).json(voter);
	} catch (error) {
		res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: `Error: ${error}` });
	}
};

export const getVoters = async (req: Request, res: Response) => {
	try {
		const voters = await Voter.find();
		res.status(HttpStatusCode.OK).json(voters);
	} catch (error) {
		res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: `Error: ${error}` });
	}
};

export const registerVoter = async (req: Request, res: Response) => {
	const { fullName, aadhaarNumber, base64Data } = req.body;

	try {
		const voterID = await generateUniqueID();
		const pictureURL = await saveVoterImage(base64Data, VOTERS_PATH, voterID);

		const newVoter = new Voter({
			fullName,
			aadhaarNumber,
			voterID,
			pictureURL,
		});

		await newVoter.save();

		return res.status(HttpStatusCode.CREATED).json({ message: "Voter registered successfully!" });
	} catch (error) {
		console.log(error);

		res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: `Error: ${error}` });
	}
};

export const deleteVoter = async (req: Request, res: Response) => {
	try {
		const { aadhaarNumber } = req.params;
		const voter = await Voter.findOne({ aadhaarNumber });
		if (voter) {
			if (voter.voterID) {
				await deleteVoterImage(voter.voterID, VOTERS_PATH);
			} else {
				console.log("No picture URL found for voter.");
			}

			const voterDeleteStatus = await Voter.deleteOne({ aadhaarNumber });
			if (voterDeleteStatus.deletedCount) {
				res.status(HttpStatusCode.OK).json({ message: "Voter deleted successfully!" });
			} else {
				res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Voter could not be deleted!" });
			}
		} else {
			res.status(HttpStatusCode.NOT_FOUND).json({ message: "Voter not found." });
		}
	} catch (error: any) {
		res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: `Error: ${error.message}` });
	}
};
