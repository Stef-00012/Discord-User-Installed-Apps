import { Client as DiscordClient, Collection } from "discord.js";
import type { Command } from "../types/command";
import type { Config } from "../types/config";
import Functions from "../data/functions";
import BotConfig from "../../config";
import DbSchema from "../db/schema";
import Db from "../db/db";

export class Client extends DiscordClient {
	readonly config: Config = BotConfig;
	readonly functions = Functions;
	readonly commands: Collection<string, Command> = new Collection();
	readonly dbSchema = DbSchema;
	readonly db = Db;
}
