const router = require('express').Router()
const UserModel = require('../models/UserMode')
const jwt = require('jsonwebtoken')
const { encryptPassword, verifyPassword } = require('../lib/functions')

router.post('/signIn', async (req, res) => {
    const { user, password } = req.body
    const getUser = await UserModel.findOne({user}).exec()
    if(getUser) {
        const verifyPass = await verifyPassword(password, getUser.password)
        if(verifyPass){
            jwt.sign({user: getUser}, process.env.SECRET_KEY, (err, token) => {
                if(err) res.json({server: 'serverConflict'})
                else {
                    res.json({server: 'successfulLogin', dataUser: {token, id: getUser._id, user: getUser.user} })
                }
            })
        } else res.json({server: 'userNotExist'})
    } else res.json({server: 'userNotExist'})
})

router.post('/signUp', async (req, res) => {
    const { user, password } = req.body
    if(user && password) {
        const newUser = new UserModel({
            user,
            password: await encryptPassword(password)
        })

        try {
            await newUser.save()
            res.json({server: 'userRegistered'})
        } catch (e) {
            res.json({server: 'userExist'})
        }
        
    } else {
        res.status(200).json({server: 'userNotRegister'})
    }
})

module.exports = router