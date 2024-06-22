import mongoose from "mongoose";

const voterSchema = new mongoose.Schema({
	fullName: {
		type: String,
		required: true,
		minLength: [6, "Name should be of atleast 6 characters, got {VALUE}."],
		maxLength: [50, "Name can be of atmost 50 characters, got {VALUE}."],
	},
	aadhaarNumber: {
		type: Number,
		required: [true, "Aadhaar Number cannot be empty."],
		unique: true,
		min: [100000000000, "Aadhaar Number cannot be lower than 12 digits."],
		max: [999999999999, "Aadhaar Number cannot be more than 12 digits."],
	},
	voterID: {
		type: Number,
		required: true,
	},
	pictureURL: {
		type: String,
		required: true,
	},
	votingStatus: {
		type: Boolean,
		default: false,
	},
});

export const Voter = mongoose.model("Voter", voterSchema);
