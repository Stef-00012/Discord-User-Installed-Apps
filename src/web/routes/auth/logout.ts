import express, { type NextFunction, type Request, type Response } from 'express'
import { eq } from 'drizzle-orm'
import type { Client } from '../../../structures/DiscordClient';
import type { DatabaseTokenData, DatabaseUserData } from '../../../types/discord';

export default function(client:Client) {
    const router = express.Router()

    router.get("/logout", async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        if (req.query?.success === "1") return res.render('auth/logoutSuccess');
        if (req.query?.r === "2") return res.redirect('/unauthorized');

        const tokenData: null | DatabaseUserData = await client.functions.getToken(client, req.cookies?.id)
        
        if (!tokenData || !req.cookies?.id) {
            if (req.query?.r === "1") return res.redirect('/logout?r=2');

            return res.redirect('/logout?success=1');
        }

        const tokensSchema = client.dbSchema.tokens

        await client.db
            .delete(tokensSchema)
            .where(
                eq(tokensSchema.id, tokenData.id)
            )
        
        res.cookie('id', '', {
            maxAge: 0
        })

        if (req.query?.r === "1") return res.redirect('/logout?r=2');
        
        return res.redirect("/logout?success=1");
    })

    return router;
}