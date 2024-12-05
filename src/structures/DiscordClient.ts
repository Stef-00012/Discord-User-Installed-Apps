import { Client as DiscordClient, Collection } from "discord.js";
import BotConfig from "../../config";
import type { Config } from "../types/config";
import type { Command } from "../types/command";
import DbSchema from "../db/schema";
import Db from "../db/db";
import Functions from '../data/functions'

export class Client extends DiscordClient {
	readonly config: Config = BotConfig;
	readonly functions = Functions;
	readonly commands: Collection<string, Command> = new Collection();
	readonly dbSchema = DbSchema;
	readonly db = Db;
}