const {
    ApplicationCommandType,
    ApplicationCommandOptionType
} = require('discord.js')

module.exports = [
    {
        name: 'deploy',
        description: 'Deploys the user commands',
        type: ApplicationCommandType.ChatInput,
        integration_types: [0, 1],
        contexts: [0, 1, 2]
    },
    {
    	name: 'eval',
    	description: 'Executes the given code',
    	type: ApplicationCommandType.ChatInput,
    	integration_types: [0, 1],
    	contexts: [0, 1, 2],
    	options: [
    		{
    			name: 'code',
    			type: ApplicationCommandOptionType.String,
    			description: 'The code to execute',
    			required: true
    		},
    		{
    			name: 'personal',
    			type: ApplicationCommandOptionType.Boolean,
    			description: 'If hide the output or not',
    			required: false
    		}
    	]
    }
]