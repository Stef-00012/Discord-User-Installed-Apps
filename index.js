const {
    Client,
    GatewayIntentBits,
    Partials,
    Collection
} = require('discord.js')
const fs = require('fs')

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

const events = fs.readdirSync(`${__dirname}/events`).filter(file => file.endsWith('.js'))
const commands = fs.readdirSync(`${__dirname}/commands`).filter(file => file.endsWith('.js'))

for (const event of events) {
    const eventData = require(`${__dirname}/events/${event}`)

    client.on(event.split('.')[0], eventData.bind(null, client))
    
    console.log(`Loaded the event "${event.split('.')[0]}"`)
}

for (const command of commands) {
    const commandData = require(`${__dirname}/commands/${command}`)
    
    client.commands.set(commandData.name, commandData)
    
    console.log(`Loaded the command "${command.split('.')[0]}"`)
}

client.login(client.config.token)