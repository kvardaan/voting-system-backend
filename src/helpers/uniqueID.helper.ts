export const generateUniqueID = async (): Promise<string> => {
	const timestampPart = new Date().toISOString().slice(0, 7).replace("-", "");
	const randomDigits = Math.floor(1000000 + Math.random() * 9000000).toString();
	const uniqueID = `${timestampPart}${randomDigits}`;

	return uniqueID;
};
