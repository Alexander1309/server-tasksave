const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const encryptPassword = async password => {
    try {
        const salt = await bcryptjs.genSalt(10)
        const hash = await bcryptjs.hash(password, salt)
        return hash
    } catch (e) {
        return null
    }
}

const verifyPassword = async (password, hash) => {
    try {
        return await bcryptjs.compare(password, hash)
    } catch (e) {
        return false
    }
}

const verifyToken = (req, res, next) => {
    try {
        const token = req.headers['authorization'].split(' ')[1]
        if(token !== undefined) {
            jwt.verify(token, process.env.SECRET_KEY, (err, data) => {
                if(err) res.sendStatus(403)
                else {
                    const dataUser = {
                        id: data.user._id,
                        user: data.user.user,
                        password: data.user.password,
                        registeredOn: data.user.registeredOn
                    }
                    req.user = dataUser
                    next()
                }
            })
        } else res.sendStatus(409)
    } catch (e) {
        res.sendStatus(409)
    }
}

module.exports = {
    encryptPassword,
    verifyPassword,
    verifyToken
}