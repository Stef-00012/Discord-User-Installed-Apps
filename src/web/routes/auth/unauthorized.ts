import type { Client } from "../../../structures/DiscordClient";
import express, {
	type NextFunction,
	type Request,
	type Response,
} from "express";

export default function (client: Client) {
	const router = express.Router();

	router.get(
		"/unauthorized",
		(req: Request, res: Response, next: NextFunction): any => {
			res.render("auth/unauthorized");
		},
	);

	return router;
}
