// const express = require('express');
// const user = require('./user.model');
// const router = express.Router();



// router.post('/register', async(req, res)=>{
//  try {

//     const {username, email, password} = req.body;
//     const userModel = new user({username, email, password})
//     // await userModel.save()
//     res.status(201).send(req.body)
    
//  } catch (error) {
//     res.send(error, "error occured in response")
//  }
// })

// module.exports = router


const express = require('express');
const User = require('./user.model'); // capital U (convention)
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

module.exports = router;
