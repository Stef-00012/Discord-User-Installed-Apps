const joi = require('joi')
const fs = require('node:fs')
const path = require('node:path')
const express = require('express')

module.exports = (client) => {
    const router = express.Router()

    router.post('/permissions', (req, res, next) => {
        const commands = client.commands.map(cmd => cmd.name)
        const inputPermissions = req.body.permissions

        let validator = joi.object()

        for (const command of commands) {
            validator = validator.append({
                [command]: joi
                .array()
                .items(
                    joi
                        .string()
                        .regex(/^\d{15,21}$/)
                        .optional()
                )
                .default([])
            })
        }

        const {
            error,
            value
        } = validator.validate(inputPermissions)

        if (error) return res.status(400).json({
            error: error.details.map(err => err.message)
        })

        const commandPermissionsPath = path.join(__dirname, '../../../data/permissions/commandPermissions.json')

        fs.writeFileSync(commandPermissionsPath, JSON.stringify(value, null, 4))

        return res.sendStatus(204)
    })


    return router;
}