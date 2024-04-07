const axios = require('axios')
require('dotenv').config();
const authServiceUrl = process.env.AUTH_SERVICE_URL
class AuthService{
    login(username, password){
        return new Promise(async (resolve,reject) => {
            try {
                let response = await axios.post(authServiceUrl + "/auth/login", {
                    username: username,
                    password: password
                })
                resolve(response.data)
            }catch (e){
                reject(e)
            }
        })
    }
    
    register(username, password, role){
        return new Promise(async (resolve,reject) => {
            try {
                let response = await axios.post(authServiceUrl + "/auth/register", {
                    username: username,
                    password: password,
                    role: role
                })
                resolve(response.data)
            }catch (e){
                reject(e)
            }
        })
    }
    
    checkToken(token){
        return new Promise(async (resolve,reject) => {
            try {
                let response = await axios.post(authServiceUrl + "/auth/check", {},{
                    headers: {Authorization: token}
                })
                resolve(response.data.authenticated)
            }catch (e){
                reject(e)
            }
        })
    }
}

module.exports = new AuthService()
