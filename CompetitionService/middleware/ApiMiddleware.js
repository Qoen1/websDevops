function authenticateAPIToken(req, res, next) {
    const apikey = req.headers.apikey
    if(!apikey) {
        return res.status(401).json({ error: 'Unauthorized - No valid token provided' })
    }
    if(apikey != process.env.GATEWAY_TOKEN) {
        return res.status(401).json({error: 'Unauthorized - Invalid API key'})
    }
    else{
        console.log('yippie!')
    }
    next()
}

module.exports = authenticateAPIToken;