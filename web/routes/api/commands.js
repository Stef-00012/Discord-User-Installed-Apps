const joi = require('joi')
const fs = require('node:fs')
const path = require('node:path')
const express = require('express')
const startMongo = require('../../../mongo/start.js')

module.exports = (client) => {
    const router = express.Router()

    router.post('/commands', (req, res, next) => {
        const commands = client.commands.map(cmd => cmd.name)
        const inputCommands = req.body.commands

        if (!inputCommands) return res.status(400).json({
            error: '"command" field is missing'
        })

        let validator = joi.object()

        for (const command of commands) {
            validator = validator.append({
                [command]: joi
                    .boolean()
                    .default(false)
            })
        }

        const { error, value } = validator.validate(inputCommands)

        if (error) return res.status(400).json({
            error: error.details.map(err => err.message)
        })

        for (const command in value) {
            if (!value[command]) continue;

            const commandData = client.commands.get(command)

            if (commandData.requires.includes("mongo")) {
                if (!client.config.mongo)
                    return res.status(400).json({
                        error: `You must add a MongoDB url in order to be able to enable the command "${command}"`
                    });
        
                if (!client.mongo.isConnected()) startMongo(client);
            }
        
            if (
                commandData.requires.includes("naviac") &&
                ["username", "token"].some((cfg) => !client.config?.naviac?.[cfg])
            ) {
                return res.status(400).json({
                    error: `You must add a N.A.V.I.A.C. username and token in order to be able to enable the command "${command}"`
                });
            }
        
            if (
                commandData.requires.includes("gary") &&
                !client.config?.gary?.apiKey
            ) {
                return res.status(400).json({
                    error: `You must add a Gary API key in order to be able to enable the command "${command}"`
                });
            }
        
            if (
                commandData.requires.includes("zipline") &&
                ["token", "url", "chunkSize", "maxFileSize"].some(
                    (cfg) => !client.config?.zipline?.[cfg],
                )
            ) {
                return res.status(400).json({
                    error: `You must add your zipline token, url and chunk size in order to be able to enable the command "${command}"`
                });
            }
        }

        const commandStatusPath = path.join(__dirname, '../../../data/commandStatus.json')

        fs.writeFileSync(commandStatusPath, JSON.stringify(value, null, 4))

        return res.sendStatus(201)
    })


    return router;
}