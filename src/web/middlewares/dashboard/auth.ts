import type { Client } from "../../../structures/DiscordClient";
import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

export default function (client: Client) {
	return async (
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<any> => {
		if (!client.config.web)
			return res.status(403).json({
				error: "Incomplete Web Settings",
			});

		const auth = req.cookies?.id;

		if (!auth) return res.redirect("/login?a=1");

		let decodedAuth: JwtPayload;

		try {
			decodedAuth = jwt.verify(
				auth,
				client.config.web.jwt.secret,
			) as JwtPayload;
		} catch (e) {
			return res.redirect("/login?a=1");
		}

		if (!client.config.owners.includes(decodedAuth.userId))
			return res.redirect("/logout?r=1");

		next();
	};
}
