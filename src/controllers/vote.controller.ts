import axios from "axios";
import { configDotenv } from "dotenv";
import { Request, Response } from "express";

import { Voter } from "../db/voter.dbSchema";
import { Candidate } from "../db/candidate.dbSchema";
import { HttpStatusCode } from "../utils/httpStatusCodes";
import { generateUniqueID } from "../helpers/uniqueID.helper";
import { deleteVoterImage, saveVoterImage } from "../helpers/imageManage.helper";

configDotenv();
const { TEMP_VOTERS_PATH } = process.env;

export const submitVote = async (req: Request, res: Response) => {
	const { aadhaarNumber, _id: candidateId, base64Data } = req.body;

	try {
		const voter = await Voter.findOne({ aadhaarNumber });
		if (!voter) {
			return res.status(HttpStatusCode.NOT_FOUND).json({ error: "Voter not found" });
		}

		if (voter.votingStatus) {
			return res.status(HttpStatusCode.BAD_REQUEST).json({ error: "Voter has already voted" });
		}

		const tempID = await generateUniqueID();
		const tempPictureURL = await saveVoterImage(base64Data, TEMP_VOTERS_PATH, tempID);

		const voterVerified: any = await axios({
			method: "post",
			url: "http://127.0.0.1:8000/compare_images",
			data: {
				image1_url: voter.pictureURL,
				image2_url: tempPictureURL,
			},
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (voterVerified.data.verified) {
			await Voter.findOneAndUpdate({ aadhaarNumber }, { votingStatus: true });
			await Candidate.findByIdAndUpdate(candidateId, { $inc: { votes: 1 } });
			await deleteVoterImage(tempID, TEMP_VOTERS_PATH);

			return res.status(HttpStatusCode.CREATED).json({ message: "Voted Successfully!" });
		}

		return res.status(HttpStatusCode.BAD_REQUEST).json({ message: "Voter cannot be verified!" });
	} catch (error) {
		return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });
	}
};

export const getVotes = async (req: Request, res: Response) => {
	try {
		const candidates = await Candidate.find();

		let maxVotes = 0;
		let winners: any = [];
		let tiedCandidates = [];
		let anyVotes = false;

		for (const candidate of candidates) {
			if (candidate.votes > 0) {
				anyVotes = true;
			}

			if (candidate.votes > maxVotes) {
				maxVotes = candidate.votes;
				winners = [candidate];
				tiedCandidates = [];
			} else if (candidate.votes === maxVotes && candidate.votes > 0) {
				winners.push(candidate);
				tiedCandidates.push(candidate.candidateName);
			}
		}

		let message = "";
		let winnerData = null;
		if (anyVotes) {
			if (winners.length === 1) {
				message = `Candidate ${winners[0].candidateName} is the winner with ${maxVotes} votes`;
				winnerData = winners[0];
			} else if (winners.length > 1) {
				message = `There is a tie between candidates: ${tiedCandidates.join(", ")} with ${maxVotes} votes`;
			}
		}

		return res.status(HttpStatusCode.OK).json({ winner: winnerData, message });
	} catch (error) {
		return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });
	}
};
