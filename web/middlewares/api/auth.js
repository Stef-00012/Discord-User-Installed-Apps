const jwt = require('jsonwebtoken')

module.exports = (client) => {
    return async (req, res, next) => {
        const auth = req.cookies?.id
    
        if (!auth) return res.status(403).json({
            error: "Missing Token"
        });
    
        let decodedAuth;

        try {
            decodedAuth = jwt.verify(auth, client.config.web.jwt.secret)

            if (!client.config.owners.includes(decodedAuth.userId)) return res.status(403).json({
                error: "ID is not allowed"
            })
        } catch(e) {
            return res.status(403).json({
                error: "Invalid Token"
            });
        }
    
        next()
    }
}