const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema({
    firstName: {type:String, required: true},
    lastName: {type:String, required: true},
    email: {type:String, required: true},
    username: {type:String, required: true, unique: true},
    password: {type:String, required: true},
    createdAt: {type:String, default: Date.now}
 })

UserSchema.pre('save', async function(next) {
    if(!this.isModified('password')) return next()
    
    try {
        const salt = await bcrypt.genSalt(10)
        this.password = await bcrypt.hash(this.password, salt)
        next()
    } catch (error) {
        next(error)
    }
})

const User = mongoose.model('User', UserSchema)
module.exports = User