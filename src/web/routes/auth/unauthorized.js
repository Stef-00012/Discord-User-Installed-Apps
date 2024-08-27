const express = require('express')
const jwt = require('jsonwebtoken')

module.exports = (client) => {
    const router = express.Router()

    router.get("/unauthorized", async (req, res) => {
        res.render('auth/unauthorized')
    })

    return router;
}