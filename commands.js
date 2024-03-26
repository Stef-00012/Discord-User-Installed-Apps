const {
    ApplicationCommandType,
    ApplicationCommandOptionType
} = require('discord.js')

module.exports = [
    // slash commands
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
    },
    {
        name: 'embed',
        description: 'Sends an embed with the given data',
        type: ApplicationCommandType.ChatInput,
        integration_types: [0, 1],
        contexts: [0, 1, 2],
        options: [
            {
                name: 'title',
                type: ApplicationCommandOptionType.String,
                description: 'Embed title',
                required: false,
                max_length: 256
            },
            {
                name: 'description',
                type: ApplicationCommandOptionType.String,
                description: 'Embed description',
                required: false,
                max_length: 4096
            },
            {
                name: 'url',
                type: ApplicationCommandOptionType.String,
                description: 'Embed URL',
                required: false
            },
            {
                name: 'timetstamp',
                type: ApplicationCommandOptionType.Boolean,
                description: 'Embed timestamp',
                required: false
            },
            {
                name: 'color',
                type: ApplicationCommandOptionType.String,
                description: 'Embed color',
                required: false,
                max_length: 4096
            },
            {
                name: 'footer-text',
                type: ApplicationCommandOptionType.String,
                description: 'Embed footer text',
                required: false,
                max_length: 2048
            },
            {
                name: 'footer-icon',
                type: ApplicationCommandOptionType.String,
                description: 'Embed footer icon',
                required: false
            },
            {
                name: 'image',
                type: ApplicationCommandOptionType.String,
                description: 'Embed image',
                required: false
            },
            {
                name: 'thumbnail',
                type: ApplicationCommandOptionType.String,
                description: 'Embed thumbnail',
                required: false,
                max_length: 4096
            },
            {
                name: 'author-name',
                type: ApplicationCommandOptionType.String,
                description: 'Embed author name',
                required: false,
                max_length: 256
            },
            {
                name: 'author-icon',
                type: ApplicationCommandOptionType.String,
                description: 'Embed author icon',
                required: false
            },
            {
                name: 'fields',
                type: ApplicationCommandOptionType.Boolean,
                description: 'Embed fields',
                required: false
            },
        ]
    },
    {
        name: 'status',
        description: 'Changes the enabled statud of a command',
        type: ApplicationCommandType.ChatInput,
        integration_types: [0, 1],
        contexts: [0, 1, 2],
        options: [
            {
                name: 'enable',
                type: ApplicationCommandOptionType.Subcommand,
                description: 'Enables a command',
                options: [
                    {
                        name: 'command',
                        description: 'The command to enable',
                        type: ApplicationCommandOptionType.String,
                        autocomplete: true,
                        required: true
                    }
                ]
            },
            {
                name: 'disable',
                type: ApplicationCommandOptionType.Subcommand,
                description: 'Disables a command',
                options: [
                    {
                        name: 'command',
                        description: 'The command to enable',
                        type: ApplicationCommandOptionType.String,
                        autocomplete: true,
                        required: true
                    }
                ]
            }
        ]
    },
    {
        name: 'qr',
        description: 'Create a QR code',
        type: ApplicationCommandType.ChatInput,
        integration_types: [0, 1],
        contexts: [0, 1, 2],
        options: [
            {
                name: 'text',
                type: ApplicationCommandOptionType.String,
                description: 'The text to convert to a QR code',
                required: true,
                max_length: 900
            },
            {
                name: 'type',
                type: ApplicationCommandOptionType.String,
                description: 'QR code type',
                required: false,
                choices: [
                    {
                        name: 'Text',
                        value: 'text'
                    },
                    {
                        name: 'Image',
                        value: 'image'
                    }
                ]
            }
        ]
    },

    // message commands
    {
        name: 'Save as Tag',
        type: ApplicationCommandType.Message,
        integration_types: [0, 1],
        contexts: [0, 1, 2],
    },
    {
        name: 'Get Message JSON',
        type: ApplicationCommandType.Message,
        integration_types: [0, 1],
        contexts: [0, 1, 2],
    },
    {
        name: 'Convert to QR Code',
        type: ApplicationCommandType.Message,
        integration_types: [0, 1],
        contexts: [0, 1, 2],
    },

    // user commands
    {
        name: 'Get User JSON',
        type: ApplicationCommandType.User,
        integration_types: [0, 1],
        contexts: [0, 1, 2],
    },
    {
        name: 'Get Member JSON',
        type: ApplicationCommandType.User,
        integration_types: [0, 1],
        contexts: [0],
    },
    {
        name: 'Get User Avatar',
        type: ApplicationCommandType.User,
        integration_types: [0, 1],
        contexts: [0, 1, 2],
    },
    {
        name: 'Get Member Avatar',
        type: ApplicationCommandType.User,
        integration_types: [0, 1],
        contexts: [0],
    }
]