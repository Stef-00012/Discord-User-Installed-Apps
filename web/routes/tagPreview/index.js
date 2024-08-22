const express = require('express')

module.exports = (client) => {
    const router = express.Router()

    router.get('/tags/:id', (req, res, next) => {
        try {
            const json = global.cache[req.params.id]
    
            if (!json || (!json.content && (!json.embeds || json.embeds?.length <= 0))) return res.sendStatus(400);
    
            const base64json = btoa(JSON.stringify(json))
    
            return res.render('tags/preview', {
                json: base64json,
                avatar: client.user.avatarURL(),
                username: client.user.username
            })
        } catch(e) {
            console.log(e)
            return res.sendStatus(500)
        }
    })

    return router;
}