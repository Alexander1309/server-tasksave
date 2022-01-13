const { model, Schema } = require('mongoose')

const UserModel = new model('users', new Schema({
    user: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    registeredOn: { type: Date, default: Date.now, required: true }
}))

module.exports = UserModel