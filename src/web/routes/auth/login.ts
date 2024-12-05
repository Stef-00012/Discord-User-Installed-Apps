import express, { type NextFunction, type Request, type Response } from 'express'
import jwt, { type JwtPayload } from 'jsonwebtoken'
import type { Client } from '../../../structures/DiscordClient'
import type { DatabaseUserData } from '../../../types/discord'

export default function(client: Client) {
    const router = express.Router()

    router.get("/login", async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        if (req.query?.a === "1" || !client.config.web) return res.render("auth/notLogged")

        const tokenData: null | DatabaseUserData = await client.functions.getToken(client, req.cookies?.id)
        
        if (tokenData) {
            if (!client.config.owners.includes(tokenData.id)) return res.redirect('/logout?r=1');
            
            return res.redirect('/dashboard');
        }

        const code = req.query?.code

        if (!code) return res.redirect(`https://discord.com/oauth2/authorize?client_id=${client.config.web.auth.clientId}&response_type=code&redirect_uri=${encodeURIComponent(client.config.web.auth.redirectURI)}&scope=${client.config.web.auth.scopes}`);

        const hashedId: string | null = await client.functions.getAccessToken(client, code)

        if (!hashedId) return res.redirect('/dashboard');

        const decodedAuth = jwt.verify(hashedId, client.config.web.jwt.secret) as JwtPayload

        if (!client.config.owners.includes(decodedAuth.userId)) return res.redirect('/logout?r=1');

        res.cookie('id', hashedId, {
            httpOnly: true,
            expires: new Date('2038-01-19T04:14:07.000Z'),
            // maxAge: 2_419_200_000 // 28 days in milliseconds
        })
        return res.redirect('/dashboard');
    })

    return router;
}