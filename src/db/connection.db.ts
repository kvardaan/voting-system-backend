import { configDotenv } from "dotenv";
import mongoose from "mongoose";

configDotenv();
const { MONGO_URL, DB_NAME } = process.env;

export const connectDB = async () => {
	try {
		await mongoose.connect(`${MONGO_URL}/${DB_NAME}`);
		console.log("Connected to the database!");
	} catch (error) {
		console.log(`Error: ${error}`);
	}
};
