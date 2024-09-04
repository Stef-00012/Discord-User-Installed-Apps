const fs = require('node:fs')
const path = require('node:path')
const mongoose = require("mongoose");
const db = require('../src/db/db.js')();
const sqlSchema = require('../src/db/schema.js');
let mongoURI;

const configPath = path.join(
    __dirname,
    '../config.js'
)

if (fs.existsSync(configPath)) {
    mongoURI = require('../config.js').mongo
} else {
    mongoURI = process.argv[2]
}

if (!mongoURI) {
    console.log("Missing MongoDB URI")

    process.exit(1)
}

const mongoSchema = {
    tags: mongoose.model(
        "tags",
        new mongoose.Schema({
            id: {
                type: String,
            },
            tags: [
                {
                    name: {
                        type: String,
                    },
                    data: {
                        content: {
                            type: String,
                            nullable: true,
                        },
                        embeds: {
                            type: Object,
                            nullable: true,
                        },
                    },
                },
            ],
        }),
    ),

    ptero: mongoose.model(
        "ptero",
        new mongoose.Schema({
            id: {
                type: String
            },
            panelUrl: {
                type: String
            },
            apiKey: {
                type: String
            }
        })
    ),
    
    tokens: mongoose.model(
        "tokens",
        new mongoose.Schema({
            id: {
                type: String
            },
            accessToken: {
                type: String
            },
            refreshToken: {
                type: String
            },
            expiresAt: {
                type: String
            },
            scopes: {
                type: String
            }
        })
    ),
    
    reminders: mongoose.model(
        "reminders",
        new mongoose.Schema({
            userId: {
                type: String
            },
            reminderId: {
                type: String
            },
            description: {
                type: String
            },
            date: {
                type: String
            }
        })
    ),
    
    analytics: mongoose.model(
        "analytics",
        new mongoose.Schema({
            commandName: {
                type: String
            },
            uses: {
                type: Number,
                default: 0
            }
        })
    )
};

(async () => {
    try {
        await mongoose.connect(mongoURI)
    
        const tagsUsers = await mongoSchema.tags.find({}).exec();
        const pteroUsers = await mongoSchema.ptero.find({}).exec();
        const tokensUsers = await mongoSchema.tokens.find({}).exec();
        const reminders = await mongoSchema.reminders.find({}).exec();
        const analytics = await mongoSchema.analytics.find({}).exec()
    
        for (const user of tagsUsers) {
            const userId = user.id

            for (const tag of user.tags) {
                if (tag?.data) {
                    console.log(`Transferring the tag "${tag.name}" owned by ${userId} [NEW FORMAT]`)

                    await db
                        .insert(sqlSchema.tags)
                        .values({
                            id: userId,
                            name: tag.name,
                            data: JSON.stringify(tag.data)
                        })
                } else {
                    console.log(`Transferring the tag "${tag.name}" owned by ${userId} [OLD FORMAT]`)
                    await db
                        .insert(sqlSchema.tags)
                        .values({
                            name: tag.name,
                            data: JSON.stringify({
                                content: tag.value,
                                embeds: null
                            })
                        })
                }
            }
        }

        for (const user of pteroUsers) {
            console.log(`Transferring the ptero data owned by "${user.id}"`)

            await db
                .insert(sqlSchema.ptero)
                .values({
                    id: user.id,
                    panelUrl: user.panelUrl,
                    apiKey: user.apiKey
                })
        }

        for (const user of tokensUsers) {
            console.log(`Transferring the token data owned by ${user.id}`)

            await db
                .insert(sqlSchema.tokens)
                .values({
                    id: user.id,
                    accessToken: user.accessToken,
                    refreshToken: user.refreshToken,
                    expiresAt: user.expiresAt,
                    scopes: user.scopes
                })
        }

        for (const reminder of reminders) {
            console.log(`Transferring the reminder with ID "${reminder.reminderId}" owned by "${reminder.userId}"`)

            await db
                .insert(sqlSchema.reminders)
                .values({
                    userId: reminder.userId,
                    reminderId: reminder.reminderId,
                    description: reminder.description,
                    date: reminder.date
                })
        }

        for (const analytic of analytics) {
            console.log(`Transferring the analytics for the command "${analytic.commandName}"`)

            await db
                .insert(sqlSchema.analytics)
                .values({
                    commandName: analytic.commandName,
                    uses: analytic.uses
                })
        }

        process.exit(0)
    } catch(e) {
        console.log(e, '\n\n', "Failed to connect to the MongoDB URI")
    
        process.exit(1)
    }
})()