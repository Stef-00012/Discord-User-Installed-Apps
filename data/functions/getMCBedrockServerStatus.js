//https://mcstatus.io/docs#routes
const axios = require('axios')

module.exports = async function(address) {
    const endpoint = `https://api.mcstatus.io/v2/status/bedrock/${address}`
    
    try {
        const req = await axios.get(endpoint)
        
        return req.data;
    } catch (e) {
        return null;
    }
}