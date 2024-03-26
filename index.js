const {
    Client,
    GatewayIntentBits,
    Partials,
    Collection
} = require('discord.js')
const fs = require('fs')
const mongoose = require('mongoose')

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
        GatewayIntentBits.DirectMessageReactions,

        // GatewayIntentBits.GuildPresences,
        // GatewayIntentBits.GuildMessageTyping,
        // GatewayIntentBits.DirectMessageTyping,
        // GatewayIntentBits.AutoModerationExecution
    ],
    partials: [
        Partials.Channel,
        Partials.Reaction,
        Partials.Message,
        Partials.User,
        
        // Partials.GuildMember,
        // Partials.GuildScheduledEvent,
        // Partials.ThreadMember,
    ]
})

client.config = require(`${__dirname}/config.js`)
client.commands = new Collection()
client.messageCommands = new Collection()
client.userCommands = new Collection()
client.mongo = require(`${__dirname}/mongo/schemas.js`)

const events = fs.readdirSync(`${__dirname}/events`).filter(file => file.endsWith('.js'))
const commands = fs.readdirSync(`${__dirname}/commands/slash`).filter(file => file.endsWith('.js'))
const messageContextMenuCommands = fs.readdirSync(`${__dirname}/commands/message`).filter(file => file.endsWith('.js'))
const userContextMenuCommands = fs.readdirSync(`${__dirname}/commands/user`).filter(file => file.endsWith('.js'))

const commandDirs = ['slash', 'message', 'user']

const commandStatus = fs.readFileSync(`${__dirname}/data/commandStatus.json`)
const commandStatusJSON = JSON.parse(commandStatus)

for (const dir of commandDirs) {
    const commands = fs.readdirSync(`${__dirname}/commands/${dir}`).filter(file => file.endsWith('.js'))

    for (const command of commands) {
        const commandData = require(`${__dirname}/commands/${dir}/${command}`)
        
        if (commandData.requires.includes('mongo') && !client.config.mongo) {
            console.log(`\x1b[32mYou must add a MongoDB url or disable the command "${commandData.name}" in "data/commandStatus.json"\x1b[0m`)
            process.exit(1)
        }
        
        switch(dir) {
            case 'slash': client.commands.set(commandData.name, commandData)

            case 'message': client.messageCommands.set(commandData.name, commandData)

            case 'user': client.userCommands.set(commandData.name, commandData)
        }
        
        console.log(`Loaded the ${dir} command "${command.split('.')[0]}"`)
    }
}

for (const event of events) {
    const eventData = require(`${__dirname}/events/${event}`)

    client.on(event.split('.')[0], eventData.bind(null, client))
    
    console.log(`Loaded the event "${event.split('.')[0]}"`)
}

client.login(client.config.token)

if (
    commandStatusJSON['tag'] ||
    commandStatusJSON['Save as Tag']
) {
    mongoose.connect(client.config.mongo).then(() => {
        console.log('\x1b[33mSuccessfully connected to the database (MongoDB)\x1b[0m')
    }).catch((err) => {
        console.log(err, '\x1b[31mThere was an error while connecting to the database (MongoDB)\x1b[0m')
    })
}