const db = require('../Connection/connection')
const collection = require('../Connection/collection')
const bcrypt = require('bcrypt')
const e = require('express')
module.exports = {
    registerUser: (data) => {
        return new Promise(async (resolve, reject) => {
            let user = await db.get().collection(collection.USERINFO_COLLECTION).findOne({ Email: data.Email })
            if (!user) {
                data.Password = await bcrypt.hash(data.Password, 10)
                let userData = {
                    Name: data.Name,
                    Email: data.Email,
                    Password: data.Password
                }
                db.get().collection(collection.USERINFO_COLLECTION).insertOne(userData).then((response) => {
                    resolve(response.ops[0])
                })
            } else {
                reject()
            }
        })
    },
    loginUser: (data) => {
        return new Promise(async (resolve, reject) => {
            let user = await db.get().collection(collection.USERINFO_COLLECTION).findOne({ Email: data.Email })
            if (user) {
                bcrypt.compare(data.Password, user.Password).then((response) => {
                    if (response) {
                        resolve(user)
                    } else {
                        reject()
                    }
                })
            } else {
                reject()
            }
        })
    }
}