const express = require('express');
const bcrypt = require('bcrypt')
const User = require('./user.model'); 

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

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
            res.status(200).json({message: "welcome"})
            
        }
       }


    } catch (error) {

        res.status(500).json({
            message: error.message
        })
        
    }
})

module.exports = router;
