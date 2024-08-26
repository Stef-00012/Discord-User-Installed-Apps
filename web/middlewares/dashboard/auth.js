const jwt = require('jsonwebtoken')

module.exports = (client) => {
    return async (req, res, next) => {
        const auth = req.cookies?.id
    
        if (!auth) return res.redirect('/login?a=1');
    
        let decodedAuth;

        try {
            decodedAuth = jwt.verify(auth, client.config.web.jwt.secret)
        } catch(e) {
            return res.redirect('/login?a=1');
        }
        
        if (!client.config.owners.includes(decodedAuth.userId)) return res.redirect('/logout?r=1');
    
        next()
    }
}