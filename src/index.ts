import {
	GatewayIntentBits,
	Partials,
} from "discord.js";
import { Client } from './structures/DiscordClient'
import fs from "node:fs";
import express, { type NextFunction, type Request, type Response } from 'express'
import cookieParser from 'cookie-parser'
import RoutesHander from './web/routes/export'
import MiddlewaresHandler from './web/middlewares/export'
import type { CommandStatus } from "./types/permissions";

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

global.conflicts = {};

await client.functions.init();

if (client.config.web?.enabled) {
	if (
		!client.config.web.auth ||
		!client.config.web.auth.clientId ||
		!client.config.web.auth.clientSecret ||
		!client.config.web.auth.redirectURI ||
		!client.config.web.auth.scopes
	) {
		console.log(
			"\x1b[31mYou must setup discord OAuth2 or disable the web UI\x1b[0m",
		);
	
		process.exit(1);
	}

	if (!client.config.web.jwt || !client.config.web.jwt.secret) {
		console.log(
			"\x1b[31mYou must add a JWT secret or disable the web UI\x1b[0m",
		);
	
		process.exit(1);
	}
}

const {
	auth: authRoutes,
	api: apiRoutes,
	noAuth: noAuthRoutes
} = RoutesHander(client)

const {
	dash: dashboardMiddlewares,
	api: apiMiddlewares
} = MiddlewaresHandler(client)

const app = express()
app.use(express.json())
app.use(cookieParser())
app.set('view engine', 'ejs')
app.set('views', `${__dirname}/web/views`)

app.use(express.static(`${__dirname}/web/public`))

app.get('/', (req: Request, res: Response, next: NextFunction): any => {
	return res.redirect('/dashboard');
})

for (const route in noAuthRoutes) {
	app.use('/', noAuthRoutes[route])
	
	console.log(`\x1b[38;2;131;77;179mLoaded the dashboard route "${route}" [no auth]\x1b[0m`)
}

for (const middleware in dashboardMiddlewares) {
	app.use('/', dashboardMiddlewares[middleware])

	console.log(`\x1b[38;2;131;77;179mLoaded the dashboard middleware "${middleware}"\x1b[0m`)
}

for (const route in authRoutes) {
	app.use('/', authRoutes[route])
	
	console.log(`\x1b[38;2;131;77;179mLoaded the dashboard route "${route}"\x1b[0m`)
}


for (const middleware in apiMiddlewares) {
	app.use('/api', apiMiddlewares[middleware])

	console.log(`\x1b[38;2;100;37;156mLoaded the API middleware "${middleware}"\x1b[0m`)
}

for (const route in apiRoutes) {
	app.use('/api', apiRoutes[route])

	console.log(`\x1b[38;2;100;37;156mLoaded the API route "${route}"\x1b[0m`)
}

app.all('*', (req: Request, res: Response, next: NextFunction): any => {
	res.sendStatus(404);
})

const events = fs
	.readdirSync(`${__dirname}/events`)
	.filter((file) => file.endsWith(".ts"));

const commandDirs = ["slash", "message", "user"];

const commandStatusJSON: CommandStatus = await Bun.file(`${__dirname}/data/permissions/commandStatus.json`).json();

for (const dir of commandDirs) {
	const commands = fs
		.readdirSync(`${__dirname}/commands/${dir}`)
		.filter((file) => file.endsWith(".ts"));

	for (const command of commands) {
		const commandData = (await import(`${__dirname}/commands/${dir}/${command}`)).default

		if (
			commandStatusJSON[commandData.name] &&
			commandData.requires.includes("naviac") &&
			["username", "token"].some((cfg) => !client.config.naviac?.[cfg])
		) {
			console.log(`\x1b[31mYou must add a N.A.V.I.A.C. username and token or disable the command "${commandData.name}" in "data/permissions/commandStatus.json"\x1b[0m`);

			process.exit(1);
		}

		if (
			commandStatusJSON[commandData.name] &&
			commandData.requires.includes("zipline") &&
			["token", "url", "chunkSize", "maxFileSize"].some(
				(cfg) => !client.config.zipline?.[cfg],
			)
		) {
			console.log(`\x1b[31mYou must add your zipline token, url and chunk size or disable the command "${commandData.name}" in "data/permissions/commandStatus.json"\x1b[0m`);

			process.exit(1);
		}

		const colors = {
			slash: '\x1b[34m',
			message: '\x1b[38;2;27;87;161m',
			user: '\x1b[38;2;13;67;133m'
		}

		client.commands.set(commandData.name, commandData);

		console.log(`${colors[dir]}Loaded the ${dir} command "${command.split(".")[0]}"\x1b[0m`);
	}
}

for (const event of events) {
	const eventData = (await import(`${__dirname}/events/${event}`)).default

	client.on(event.split(".")[0], eventData.bind(null, client));

	console.log(`\x1b[38;2;21;150;113mLoaded the event "${event.split(".")[0]}"\x1b[0m`);
}

client.login(client.config.token);

if (client.config.web?.enabled) {
	if (
		!client.config.web.hostname ||
		!client.config.web.port ||
		typeof client.config.web.secure !== "boolean" ||
		typeof client.config.web.keepPort !== "boolean" ||
		!client.config.web.auth ||
		!client.config.web.auth.clientId ||
		!client.config.web.auth.clientSecret ||
		!client.config.web.auth.redirectURI ||
		!client.config.web.auth.scopes ||
		!client.config.web.jwt ||
		!client.config.web.jwt.secret
	) {
		console.log(`\x1b[31mYou must fill all the configs inside the "web" object or disable the web dashboard\x1b[0m`);

		process.exit(0)
	}

	global.baseUrl = `http${client.config.web.secure ? 's' : ''}://${client.config.web.hostname || 'localhost'}${client.config.web.keepPort ? `:${client.config.web.port || 3000}` : ''}`

	app.listen(client.config.web.port || 3000, () => {
		console.log(`\x1b[36mThe web UI is online on ${global.baseUrl}\x1b[0m`)
	})

	global.conflictsInterval = setInterval(() => {
		global.conflicts = {}
	}, 1000 * 60 * 10)
}