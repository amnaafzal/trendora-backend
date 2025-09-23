const express = require('express');
const bcrypt = require('bcrypt')
const User = require('./user.model'); 
const generateToken = require('../middleware/generateToken');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const isExist =await User.findOne({email})
    if(isExist){
      res.status(500).json({ message: "email already exists." });
    }

    const newUser = new User({ username, email, password });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

       const user =await User.findOne({email})

       if(!user){
        res.status(404).json({message: "no user found"})
       }
       else{
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            res.status(404).json({message: "wrong password"})
        }else{
          const token = await generateToken(user._id)
          res.cookie('token', token, {
            httpOnly: true,
            secure: true, 
            sameSite: 'none'
          })
          
            res.status(200).json({message: "user successfully logged In", user: {
              username: user.username,
              email: user.email,
              role: user.role,
              profileImage : user.profileImage,
              bio : user.bio,
              date : user.date
            }

            })
            
        }
       }


    } catch (error) {

        res.status(500).json({
            message: error.message
        })
        
    }
})

module.exports = router;
