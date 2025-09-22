const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
  username: {type: String, unique: true, required: true},
  email: {type: String, unique: true, required: true},
  password: {type: String, required: true},
  role: { type: String, default: 'user' },
  profileImage: String,
  bio: {type: String, maxLength:200},
  date: {type: Date, default: Date.now()}
});

userSchema.pre('save', async function(next){

    if(!this.isModified('password'))
        return next()

    try {
        const salt = await bcrypt.genSalt(10)
        this.password = await bcrypt.hash(this.password, salt)
        next()
    } catch (error) {
        next(error)
        
    }


})



const user = mongoose.model('user', userSchema);
module.exports = user;