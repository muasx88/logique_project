import { NextFunction, Request, Response } from 'express';

export const validateKey = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { headers } = req;

	if (!headers || !headers['key']) {
		return res.status(403).json({ error: 'API key is missing.' });
	}

	const key = process.env.KEY as string;
	if (headers['key'] !== key) {
		return res.status(403).json({ error: 'Invalid API key.' });
	}

	next();
};
