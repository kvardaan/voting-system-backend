import cors from "cors";
import express from "express";
import { configDotenv } from "dotenv";

import rootRouter from "./routes/index.route";
import { connectDB } from "./db/connection.db";
import { logging } from "./middlewares/logging.middleware";

const app = express();
configDotenv();
connectDB();

const { PORT } = process.env;

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// middlewares
app.use(logging);

// routes
app.use("/api/v1", rootRouter);

app.listen(PORT, () => {
	console.log(`Server listening on PORT:${PORT}`);
});
