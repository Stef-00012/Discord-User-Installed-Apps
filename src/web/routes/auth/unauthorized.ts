import express, { type NextFunction, type Request, type Response } from 'express'
import jwt from 'jsonwebtoken'

export default function(client) {
    const router = express.Router()

    router.get("/unauthorized", (req: Request, res: Response, next: NextFunction): any => {
        res.render('auth/unauthorized')
    })

    return router;
}