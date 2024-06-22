import { Request, Response, NextFunction } from "express";

export const logging = (req: Request, res: Response, next: NextFunction) => {
	console.log(`Request received: ${req.method} ${req.url}`);
	next();
};
