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
    },
    {
        name: 'tag',
        description: 'Save or some premade messages',
        type: ApplicationCommandType.ChatInput,
        integration_types: [0, 1],
        contexts: [0, 1, 2],
        options: [
            {
                name: 'set',
                description: 'Set or replace a tag',
                type: ApplicationCommandOptionType.Subcommand,
                options: [
                    {
                        name: 'name',
                        description: 'The name of the tag',
                        type: ApplicationCommandOptionType.String,
                        required: true
                    },
                    {
                        name: 'content',
                        description: 'The content of the tag',
                        type: ApplicationCommandOptionType.String,
                        required: true,
                        max_length: 2000
                    }
                ]
            },
            {
                name: 'delete',
                description: 'Delete a tag',
                type: ApplicationCommandOptionType.Subcommand,
                options: [
                    {
                        name: 'name',
                        description: 'The name of the tag',
                        type: ApplicationCommandOptionType.String,
                        required: true
                    }
                ]
            },
            {
                name: 'get',
                description: 'Get a tag',
                type: ApplicationCommandOptionType.Subcommand,
                options: [
                    {
                        name: 'name',
                        description: 'The name of the tag',
                        type: ApplicationCommandOptionType.String,
                        required: true
                    },
                    {
                        name: 'ephemeral',
                        description: 'If the message should be ephemeral',
                        type: ApplicationCommandOptionType.Boolean,
                        required: false
                    }
                ]
            },
            {
                name: 'list',
                description: 'List your tags',
                type: ApplicationCommandOptionType.Subcommand
            }
        ]
    },
    {
        name: 'perms',
        description: 'changes the permissions for a command (who can use it)',
        type: ApplicationCommandType.ChatInput,
        integration_types: [0, 1],
        contexts: [0, 1, 2],
        options: [
            {
                name: 'add',
                type: ApplicationCommandOptionType.Subcommand,
                description: 'Add an user to the allowed users',
                options: [
                    {
                        name: 'command',
                        description: 'The command whose you want to change the allowed users',
                        type: ApplicationCommandOptionType.String,
                        autocomplete: true,
                        required: true
                    },
                    {
                        name: 'user',
                        description: 'The user whose you want to change the permissions for that command (id)',
                        type: ApplicationCommandOptionType.String,
                        required: true
                    }
                ]
            },
            {
                name: 'remove',
                type: ApplicationCommandOptionType.Subcommand,
                description: 'Remove an user from the allowed users',
                options: [
                    {
                        name: 'command',
                        description: 'The command whose you want to change the allowed users',
                        type: ApplicationCommandOptionType.String,
                        autocomplete: true,
                        required: true
                    },
                    {
                        name: 'user',
                        description: 'The user whose you want to change the permissions for that command (id)',
                        type: ApplicationCommandOptionType.String,
                        required: true
                    }
                ]
            },
            {
                name: 'list',
                type: ApplicationCommandOptionType.Subcommand,
                description: 'Lists the permissions for each command'
            }
        ]
    }
]