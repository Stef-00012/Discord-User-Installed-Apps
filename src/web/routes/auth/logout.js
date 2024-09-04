const jwt = require('jsonwebtoken')
const express = require('express')
const { eq } = require('drizzle-orm')

module.exports = (client) => {
    const router = express.Router()

    router.get("/logout", async (req, res) => {
        if (req.query?.success === "1") return res.render('auth/logoutSuccess');

        if (req.query?.r === "2") return res.redirect('/unauthorized');

        const tokenData = await client.functions.getToken(client, req.cookies?.id)
        
        if (!tokenData || !req.cookies?.id) {
            if (req.query?.r === "1") return res.redirect('/logout?r=2');

            return res.redirect('/logout?success=1');
        }

        const tokensSchema = client.dbSchema.tokens

        await client.db
            .delete(tokensSchema)
            .where(
                eq(tokensSchema.id, tokenData.userId)
            )
        
        res.cookie('id', '', {
            maxAge: 0
        })

        if (req.query?.r === "1") return res.redirect('/logout?r=2');
        
        return res.redirect("/logout?success=1");
    })

    return router;
}