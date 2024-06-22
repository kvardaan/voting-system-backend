import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { configDotenv } from "dotenv";

import bucket from "../db/firebase.db";

configDotenv();

export const saveVoterImage = async (
	base64Data: string,
	uploadPath: string | undefined,
	voterID: string
): Promise<string> => {
	const base64Image = base64Data.split(",")[1];
	const imageBuffer = Buffer.from(base64Image, "base64");

	const tempFilePath = path.join(__dirname, `${uuidv4()}.png`);
	fs.writeFileSync(tempFilePath, imageBuffer);

	const imageFilename = `${voterID}.png`;
	const imageBlob = bucket.file(`${uploadPath}${imageFilename}`);
	await imageBlob.save(imageBuffer, { contentType: "image/png" });
	await imageBlob.makePublic();
	const imageUrl = imageBlob.publicUrl();

	fs.unlinkSync(tempFilePath);
	return imageUrl;
};

export const deleteVoterImage = async (voterID: number | any, VOTERS_PATH: string | undefined): Promise<void> => {
	try {
		const filenameToDelete = `${VOTERS_PATH}${voterID}.png`;
		const imageBlob = bucket.file(filenameToDelete);
		await imageBlob.delete();
	} catch (error) {
		console.log(`Error deleting image: ${error}`);
	}
};

export const saveCandidateSymbol = async (
	imageFile: Express.Multer.File,
	uploadPath: string | undefined,
	candidateID: string
): Promise<string> => {
	const imageFilename = `${candidateID}.png`;
	const imageBlob = bucket.file(`${uploadPath}${imageFilename}`);
	await imageBlob.save(imageFile.buffer, { contentType: imageFile.mimetype });

	await imageBlob.makePublic();
	const symbolURL = imageBlob.publicUrl();

	return symbolURL;
};

export const deleteCandidateImage = async (candidateID: number, CANDIDATES_PATH: string | undefined): Promise<void> => {
	try {
		const filenameToDelete = `${CANDIDATES_PATH}${candidateID}.png`;
		const imageBlob = bucket.file(filenameToDelete);
		await imageBlob.delete();
	} catch (error) {
		console.log(`Error deleting image: ${error}`);
	}
};
