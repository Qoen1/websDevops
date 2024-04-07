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
                },
                {
                    headers: {ApiKey: process.env.TOKEN}
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
                },
                {
                    headers: {ApiKey: process.env.TOKEN}
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
                    headers: {Authorization: token, ApiKey: process.env.TOKEN}
                })
                resolve(response.data.authenticated)
            }catch (e){
                reject(e)
            }
        })
    }

    getUserRole(userId) {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await axios.get(`${authServiceUrl}/auth/user/${userId}/role`, {},{
                    headers: {ApiKey: process.env.TOKEN}
                })
                resolve(response.data)
            }
            catch (e) {
                reject(e);
            }
        })
    }
}

module.exports = new AuthService()
