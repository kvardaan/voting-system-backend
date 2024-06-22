import admin from "firebase-admin";
import { configDotenv } from "dotenv";

const newLocal = "../../serviceAccountKey.json";
const serviceAccount = require(newLocal);

configDotenv();
const { BUCKET_NAME } = process.env;

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
	storageBucket: BUCKET_NAME,
});

const bucket = admin.storage().bucket();

export default bucket;
