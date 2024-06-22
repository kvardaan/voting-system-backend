import mongoose, { Document } from "mongoose";

const candidateSchema = new mongoose.Schema({
	candidateName: {
		type: String,
		required: [true, "Candidate Name cannot be empty."],
		trim: true,
		minLength: [6, "Name should be of atleast 6 characters, got {VALUE}."],
		maxLength: [50, "Name can be of atmost 50 characters, got {VALUE}."],
	},
	candidateID: {
		type: Number,
		required: true,
	},
	partyName: {
		type: String,
		required: [true, "Aadhaar Number cannot be empty."],
		unique: true,
		minLength: [3, "Party Name should be of atleast 3 characters, got {VALUE}."],
		maxLength: [25, "Party Name can be of atmost 25 characters, got {VALUE}."],
	},
	symbolURL: {
		type: String,
		required: true,
	},
	votes: {
		type: Number,
		default: 0,
	},
});

export const Candidate = mongoose.model("Candidate", candidateSchema);
