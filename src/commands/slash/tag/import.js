const axios = require("axios");
const { ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType } = require("discord.js");
const { eq, and } = require("drizzle-orm");
const { randomUUID } = require('node:crypto')

module.exports = async (client, int) => {
    await int.deferReply({
        ephemeral: true
    })
    const file = int.options.getAttachment('file')
    const overwrite = int.options.getBoolean('overwrite') || false
    const checkConflicts = client.config?.web?.enabled

    if (file.contentType.split(';')[0] !== "application/json") return int.reply({
        ephemeral: true,
        content: "The uploaded file is not a JSON file"
    });

    try {
        const request = await axios.get(file.url)
        let tags = request.data

        if (typeof tags === "string") tags = JSON.parse(tags)

        const valid = tags.every(tag => {
            if (!tag.name) return false;
            if (!tag.data) return false;
            if (!tag.data.content && (!tag.data.embeds || tag.data.embeds?.length <= 0)) return false;
            if (tag.data.embeds?.length <= 0) return false;

            return true;
        })

        if (!valid) return int.editReply({
            content: "The JSON you imported is not a valid tags JSON"
        });

        const tagsSchema = client.dbSchema.tags

        let userTags = await client.db.query.tags.findMany({
            where: eq(tagsSchema.id, int.user.id)
        }) || []

        for (const tagIndex in userTags) {
            userTags[tagIndex].data = JSON.parse(userTags[tagIndex].data)
        }

        let cancelled = false;

        if (overwrite) {
            await client.db 
                .delete(tagsSchema)
                .where(
                    eq(tagsSchema.id, int.user.id)
                )

            userTags = tags
        } else {
            const conflicts = []

            for (const tag of tags) {
                const existingTag = userTags.map(userTag => ({
                    name: userTag.name,
                    data: userTag.data
                })).find(userTag => userTag.name === tag.name)

                if (existingTag) {
                    userTags = userTags.filter(userTag => userTag.name !== tag.name)

                    if (JSON.stringify(existingTag) !== JSON.stringify(tag)) {
                        if (!checkConflicts) return userTags.push(tag);
                        
                        conflicts.push([
                            existingTag,
                            tag
                        ])

                        continue;
                    }
                }
    
                userTags.push(tag)
            }

            const btnId = randomUUID().slice(0, 8)
            
            const cancelButton = new ButtonBuilder()
                .setStyle(ButtonStyle.Secondary)
                .setLabel("Cancel Import")
                .setCustomId(`tag_cancel_${int.user.id}_${btnId}`)

            const oldButton = new ButtonBuilder()
                .setStyle(ButtonStyle.Danger)
                .setLabel('Keep Old Tag')
                .setCustomId(`tag_old_${int.user.id}_${btnId}`)

            const newButton = new ButtonBuilder()
                .setStyle(ButtonStyle.Success)
                .setLabel('Overwrite with New Tag')
                .setCustomId(`tag_new_${int.user.id}_${btnId}`)

            const row = new ActionRowBuilder()
                .addComponents([
                    cancelButton,
                    oldButton,
                    newButton
                ])
            
            for (const conflict of conflicts) {
                if (cancelled) continue;

                let oldId = randomUUID().slice(0, 8)
                let newId = randomUUID().slice(0, 8)

                while(global.conflicts[oldId]) {
                    oldId = randomUUID().slice(0, 8)
                }

                while(global.conflicts[newId]) {
                    newId = randomUUID().slice(0, 8)
                }

                clearInterval(global.conflictsInterval)

                global.conflictsInterval = setInterval(() => {
                    global.conflicts = {}
                }, 1000 * 60 * 10)

                global.conflicts[oldId] = conflict[0].data
                global.conflicts[newId] = conflict[1].data

                const message = await int.editReply({
                    content: `There ${conflicts.length > 1 ? 'are' : 'is'} ${conflicts.length} conflicts\n\nTag Name: "${conflict[0].name}"\n[Old Tag Data](${global.baseUrl}/tags/${oldId}) - [New Tag Data](${global.baseUrl}/tags/${newId})`,
                    components: [row]
                })

                await new Promise((resolve) => {
                    const buttonCollector = message.createMessageComponentCollector({
                        componentType: ComponentType.Button,
                        max: 1,
                        time: 1000 * 60 * 5,
                        filter: (btn) => [
                            `tag_cancel_${int.user.id}_${btnId}`,
                            `tag_old_${int.user.id}_${btnId}`,
                            `tag_new_${int.user.id}_${btnId}`
                        ].includes(btn.customId)
                    })
    
                    buttonCollector.on('collect', async (button) => {
                        if (button.customId === `tag_cancel_${int.user.id}_${btnId}`) {
                            cancelled = true;

                            try {
                                await int.editReply({
                                    content: "The import has been cancelled",
                                    components: []
                                })

                                return resolve()
                            } catch(e) {
                                return resolve();
                            }
                        }

                        if (button.customId === `tag_old_${int.user.id}_${btnId}`) {
                            await  userTags.push(conflict[0])
                            
                            await button.reply({
                                content: "Successfully kept the old tag",
                                ephemeral: true
                            })

                            return resolve();
                        }

                        if (button.customId === `tag_new_${int.user.id}_${btnId}`) {
                            await userTags.push(conflict[1])
                            
                            await button.reply({
                                content: "Successfully overwrote the new tag",
                                ephemeral: true
                            })
    
                            return resolve()
                        }
                    })

                    buttonCollector.on('end', async (_, reason) => {
                        if (reason === 'time') {
                            cancelled = true;

                            try {
                                const disabledCancelButton = cancelButton.setDisabled(true)
                                const disabledOldButton = oldButton.setDisabled(true)
                                const disabledNewButton = newButton.setDisabled(true)
        
                                const disabledRow = new ActionRowBuilder()
                                    .addComponents([
                                        disabledCancelButton,
                                        disabledOldButton,
                                        disabledNewButton
                                    ])
        
                                await int.editReply({
                                    content: "You took too long to reply, the import has been cancelled",
                                    components: [disabledRow]
                                })

                                return resolve()
                            } catch(e) {
                                return resolve();
                            }
                        }

                        return resolve()
                    })
                })
            }
        }

        if (cancelled) return;

        // await userData.save()

        for (const tag of userTags) {
            tag.data = JSON.stringify(tag.data)

            await client.db
                .insert(tagsSchema)
                .values({
                    id: int.user.id,
                    name: tag.name,
                    data: tag.data
                })
                .onConflictDoUpdate({
                    target: [tagsSchema.id, tagsSchema.name],
                    set: {
                        data: tag.data
                    }
                })
        }

        await int.editReply({
            content: `Successfully imported ${tags.length} tags`,
            components: []
        })
    } catch(e) {
        console.log(e)
        return int.editReply({
            content: "Something went wrong..."
        })
    }
}