import type { NextFunction, Request, Response } from 'express';
import jwt, { type JwtPayload } from 'jsonwebtoken'
import type { Client } from '../../../structures/DiscordClient';

export default function (client: Client) {
    return async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        if (!client.config.web) return res.status(403).json({
            error: "Incomplete Web Settings"
        });

        const auth = req.cookies?.id

        if (!auth) return res.status(403).json({
            error: "Missing Token"
        });

        let decodedAuth: JwtPayload;

        try {
            decodedAuth = jwt.verify(auth, client.config.web.jwt.secret) as JwtPayload

            if (!client.config.owners.includes(decodedAuth.userId)) return res.status(403).json({
                error: "ID is not allowed"
            })
        } catch (e) {
            return res.status(403).json({
                error: "Invalid Token"
            });
        }

        next()
    }
}