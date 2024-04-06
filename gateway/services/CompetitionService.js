const axios = require('axios')
class CompetitionService{
    find(id) {
        return new Promise(async (resolve, reject) => {
            try {
                let response = await axios.get("http://localhost:3000/" + id)
                resolve(response.data)
            } catch (e) {
                reject(e)
            }
        })
    }
}

module.exports = new CompetitionService()
