const {
	Client,
	GatewayIntentBits,
	Partials,
	Collection,
} = require("discord.js");
const fs = require("node:fs");
const startMongo = require(`${__dirname}/mongo/start.js`);

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildModeration,
		GatewayIntentBits.GuildEmojisAndStickers,
		GatewayIntentBits.GuildIntegrations,
		GatewayIntentBits.GuildWebhooks,
		GatewayIntentBits.GuildInvites,
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildScheduledEvents,
		GatewayIntentBits.AutoModerationConfiguration,
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.DirectMessageReactions
	],
	partials: [
		Partials.Channel,
		Partials.Reaction,
		Partials.Message,
		Partials.User
	],
});

client.config = require(`${__dirname}/config.js`);
client.functions = require(`${__dirname}/data/functions.js`);
client.commands = new Collection();
client.messageCommands = new Collection();
client.userCommands = new Collection();
client.mongo = require(`${__dirname}/mongo/schemas.js`);

const events = fs
	.readdirSync(`${__dirname}/events`)
	.filter((file) => file.endsWith(".js"));

const commandDirs = ["slash", "message", "user"];

const commandStatus = fs.readFileSync(`${__dirname}/data/commandStatus.json`);
const commandStatusJSON = JSON.parse(commandStatus);

for (const dir of commandDirs) {
	const commands = fs
		.readdirSync(`${__dirname}/commands/${dir}`)
		.filter((file) => file.endsWith(".js"));

	for (const command of commands) {
		const commandData = require(`${__dirname}/commands/${dir}/${command}`);
		
		if (commandStatusJSON[commandData.name] && commandData.requires.includes("mongo") && !client.config.mongo) {
			console.log(
				`\x1b[31mYou must add a MongoDB url or disable the command "${commandData.name}" in "data/commandStatus.json"\x1b[0m`,
			);
			
			process.exit(1);
		}
		
		if (commandStatusJSON[commandData.name] && commandData.requires.includes("naviac") && [
		    'username',
		    'token'
		].some(cfg => !client.config.naviac?.[cfg])) {
			console.log(
				`\x1b[31mYou must add a NAVIAC username and token or disable the command "${commandData.name}" in "data/commandStatus.json"\x1b[0m`,
			);
			
			process.exit(1);
		}

		if (commandStatusJSON[commandData.name] && commandData.requires.includes('zipline') && [
			'token',
			'url',
			'chunkSize',
			'maxFileSize'
		].some(cfg => !client.config.zipline?.[cfg])) {
			console.log(
				`\x1b[31mYou must add your zipline token, url and chunk size or disable the command "${commandData.name}" in "data/commandStatus.json"\x1b[0m`,
			);
			
			process.exit(1);
		}

		switch (dir) {
			case "slash":
				client.commands.set(commandData.name, commandData);
				break;

			case "message":
				client.messageCommands.set(commandData.name, commandData);
				break;

			case "user":
				client.userCommands.set(commandData.name, commandData);
		}

		console.log(`Loaded the ${dir} command "${command.split(".")[0]}"`);
	}
}

for (const event of events) {
	const eventData = require(`${__dirname}/events/${event}`);

	client.on(event.split(".")[0], eventData.bind(null, client));

	console.log(`Loaded the event "${event.split(".")[0]}"`);
}

client.login(client.config.token);

if (commandStatusJSON.tag || commandStatusJSON["Save as Tag"]) {
	startMongo(client);
}
