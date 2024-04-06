const axios = require('axios')

class AuthService{
    login(username, password){
        return new Promise(async (resolve,reject) => {
            try {
                let response = await axios.post("http://localhost:3001/auth/login", {
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
                let response = await axios.post("http://localhost:3001/auth/register", {
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
                let response = await axios.post("http://localhost:3001/auth/check", {},{
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
