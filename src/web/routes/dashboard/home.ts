import type { Client } from "../../../structures/DiscordClient";
import express, {
	type NextFunction,
	type Request,
	type Response,
} from "express";

export default function (client: Client) {
	const router = express.Router();

	router.get(
		"/dashboard",
		async (req: Request, res: Response, next: NextFunction): Promise<any> => {
			if (!client.application?.approximateUserInstallCount)
				await client.application?.fetch();

			const limit = 5;
			const commands = client.commands.map((cmd) => cmd.name);
			const users = client.application?.approximateUserInstallCount || -1;
			const avatar =
				client.user?.avatarURL({
					size: 4096,
				}) || "https://discord.com/assets/974be2a933143742e8b1.png";

			const username = client.user?.tag || "Unknown#0000";
			let mostUsedCommands = (await client.db.query.analytics.findMany()) || [];

			for (const command of commands) {
				if (!mostUsedCommands.find((cmd) => cmd.commandName === command))
					mostUsedCommands.push({
						commandName: command,
						uses: 0,
					});
			}

			mostUsedCommands = mostUsedCommands
				.sort((a, b) => b.uses - a.uses)
				.slice(0, limit);

			res.render("dashboard/home", {
				users,
				username,
				avatar,
				mostUsedCommands,
			});
		},
	);

	return router;
}
