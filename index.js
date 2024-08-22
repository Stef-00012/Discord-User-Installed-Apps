const {
	Client,
	GatewayIntentBits,
	Partials,
	Collection,
} = require("discord.js");
const fs = require("node:fs");
const express = require('express')
const startMongo = require(`${__dirname}/mongo/start.js`);

const client = new Client({
	intents: [
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.DirectMessageReactions,
	],
	partials: [
		Partials.Channel,
		Partials.Reaction,
		Partials.Message,
		Partials.User,
	],
});

global.cache = {
	abc: {
		content: "hi"
	}
}

client.config = require(`${__dirname}/config.js`);
client.functions = require(`${__dirname}/data/functions.js`);
client.commands = new Collection();
client.messageCommands = new Collection();
client.userCommands = new Collection();
client.mongo = require(`${__dirname}/mongo/schemas.js`);

client.functions.init();

const {
	dash: dashboardRoutes,
	api: apiRoutes
} = require('./web/routes/export.js')(client)

const app = express()
app.use(express.json())
app.set('view engine', 'ejs')
app.set('views', `${__dirname}/web/views`)

app.use(express.static('web/public'))

for (const route in dashboardRoutes) {
	app.use('/', dashboardRoutes[route])
	
	console.log(`\x1b[38;2;131;77;179mLoaded the dashboard route "${route}"\x1b[0m`)
}

for (const route in apiRoutes) {
	app.use('/api', apiRoutes[route])

	console.log(`\x1b[38;2;100;37;156mLoaded the API route "${route}"\x1b[0m`)
}

app.all('*', (req, res, next) => {
	res.sendStatus(404);
})

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

		if (
			commandStatusJSON[commandData.name] &&
			commandData.requires.includes("mongo") &&
			!client.config.mongo
		) {
			console.log(
				`\x1b[31mYou must add a MongoDB url or disable the command "${commandData.name}" in "data/commandStatus.json"\x1b[0m`,
			);

			process.exit(1);
		}

		if (
			commandStatusJSON[commandData.name] &&
			commandData.requires.includes("naviac") &&
			["username", "token"].some((cfg) => !client.config.naviac?.[cfg])
		) {
			console.log(
				`\x1b[31mYou must add a NAVIAC username and token or disable the command "${commandData.name}" in "data/commandStatus.json"\x1b[0m`,
			);

			process.exit(1);
		}

		if (
			commandStatusJSON[commandData.name] &&
			commandData.requires.includes("zipline") &&
			["token", "url", "chunkSize", "maxFileSize"].some(
				(cfg) => !client.config.zipline?.[cfg],
			)
		) {
			console.log(
				`\x1b[31mYou must add your zipline token, url and chunk size or disable the command "${commandData.name}" in "data/commandStatus.json"\x1b[0m`,
			);

			process.exit(1);
		}

		const colors = {
			slash: '\x1b[34m',
			message: '\x1b[38;2;27;87;161m',
			user: '\x1b[38;2;13;67;133m'
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

		console.log(`${colors[dir]}Loaded the ${dir} command "${command.split(".")[0]}"\x1b[0m`);
	}
}

for (const event of events) {
	const eventData = require(`${__dirname}/events/${event}`);

	client.on(event.split(".")[0], eventData.bind(null, client));

	console.log(`\x1b[38;2;21;150;113mLoaded the event "${event.split(".")[0]}"\x1b[0m`);
}

client.login(client.config.token);

if (client.config?.web?.enabled) {
	global.baseUrl = `http${client.config?.web?.secure ? 's' : ''}://${client.config?.web?.hostname || localhost}${client.config?.web?.keepPort ? `:${client.config?.web?.port || 3000}` : ''}`

	app.listen(client.config?.web?.port || 3000, () => {
		console.log(`\x1b[36mThe web UI on the port ${client.config?.web?.port || 3000} on ${global.baseUrl}\x1b[0m`)
	})

	global.cacheInterval = setInterval(() => {
		global.cache = {}
	}, 1000 * 60 * 10)
}

if (commandStatusJSON.tag || commandStatusJSON["Save as Tag"]) startMongo(client);