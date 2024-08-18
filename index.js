const {
	Client,
	GatewayIntentBits,
	Partials,
	Collection,
} = require("discord.js");
const fs = require("node:fs");
const axios = require('axios')
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

global.cache = {}

client.config = require(`${__dirname}/config.js`);
client.functions = require(`${__dirname}/data/functions.js`);
client.commands = new Collection();
client.messageCommands = new Collection();
client.userCommands = new Collection();
client.mongo = require(`${__dirname}/mongo/schemas.js`);

client.functions.init();

const app = express()
app.use(express.json())

let rootPath = client.config?.tagPreview?.path || '/'

if (rootPath !== '/' && !rootPath.endsWith('/')) rootPath = `${rootPath}/`;

app.get(rootPath, (req, res, next) => {
	return res.sendStatus(404);
})

app.use(rootPath, express.static('tagPreview'))

app.post(rootPath, (req, res, next) => {
	const json = req.body.json

	if (!json || (!json.content && (!json.embeds || json.embeds?.length <= 0))) return res.sendStatus(400);

	const base64json = btoa(JSON.stringify(json))

	let html = fs.readFileSync('./tagPreview/index.html', 'utf-8')
	html = html
		.replace('[[[base64_data]]]', base64json)
		.replace('[[[avatar_url]]]', client.user.avatarURL())
		.replaceAll('[[[username]]]', client.user.username)
		.replaceAll('[[[root_path]]]', rootPath)

	res.send(html)
})

app.get(`${rootPath}:id`, async (req, res, next) => {
	try {
		const json = global.cache[req.params.id]

		if (!json) return res.sendStatus(404);

		const data = await axios.post(`http${client.config?.tagPreview?.secure ? 's' : ''}://${client.config?.tagPreview?.hostname || localhost}${client.config?.tagPreview?.keepPort ? `:${client.config?.tagPreview?.port || 3000}` : ''}${rootPath}`, {
			json
		})

		if (!data.data) return res.sendStatus(404);

		res.send(data.data)
	} catch(e) {
		return res.sendStatus(500)
	}
})

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

	if (client.config?.tagPreview?.enabled) app.listen(client.config.tagPreview.port, () => {
		console.log(`The tag preview is listening on the port ${client.config.tagPreview.port} on http${client.config?.tagPreview?.secure ? 's' : ''}://${client.config?.tagPreview?.hostname || localhost}${client.config?.tagPreview?.keepPort ? `:${client.config?.tagPreview?.port || 3000}` : ''}${rootPath}`)
	})
}

global.cacheInterval = setInterval(() => {
	global.cache = {}
}, 1000 * 60 * 10)