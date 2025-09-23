const jwt = require('jsonwebtoken');
const user = require('../users/user.model')
const secret_key = process.env.SECRET_KEY;

const generateToken = async (userId) => {

    const isMatch = await user.findById(userId)

    if (!isMatch)
        throw new Error("user not found");

    const token = jwt.sign({userId: user._id, role: user.role}, secret_key, { expiresIn: '1d' })
    return token;


}

module.exports = generateToken;


