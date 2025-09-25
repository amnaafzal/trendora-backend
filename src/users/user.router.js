const express = require('express');
const bcrypt = require('bcrypt')
const User = require('./user.model');
const generateToken = require('../middleware/generateToken');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

// register user

router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const isExist = await User.findOne({ email })
    if (isExist) {
      res.status(500).json({ message: "email already exists." });
    }

    const newUser = new User({ username, email, password });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// usser login

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email })

    if (!user) {
      res.status(404).json({ message: "no user found" })
    }
    else {
      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) {
        res.status(404).json({ message: "wrong password" })
      } else {
        const token = await generateToken(user._id)
        res.cookie('token', token, {
          httpOnly: true,
          secure: true,
          sameSite: 'none'
        })

        res.status(200).json({
          message: "user successfully logged In", token, user: {
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            profileImage: user.profileImage,
            bio: user.bio,
            date: user.date
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

// logout request

router.post('/logout', (req, res) => {

  res.clearCookie('token')
  res.status(200).json({ message: "logout successfully" })
})

// delete the user

router.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: "user not found" })
    }
    res.status(200).json({ message: "user deleted successfully", user: user })
  } catch (error) {
    res.status(500).json({ message: "error while deleting user", error: error.message })
  }
})


// get all users

router.get('/users', async (req, res) => {
  try {

    const all_users = await User.find({}, "id email role").sort({ createdAt: -1 })
    res.status(200).json({ message: "Got all user successfully", count: all_users.length, users: all_users })

  } catch (error) {
    res.status(500).json({ message: "error while getting all user", error: error.message })
  }
})

// update the role

router.put('/user/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const updatedUser = await User.findByIdAndUpdate(id, { role }, { new: true });

    if (!updatedUser)
      res.status(404).json({ message: "no user found" })
    res.status(200).json({ message: "role updated successfully" , user: updatedUser})

  } catch (error) {
     res.status(500).json({message: "error while updating user role", error: error.message})
  }

})

// upadate user profile

router.patch('/edit-profile', async(req, res) =>{
  const { userId, username, bio, profileImage, email} = req.body;

 try {
   if(!userId){
    res.status(400).json({message: "no userId"})
  }
  const user = await User.findById(userId);

  if(!user)
    res.status(400).json({message: "no user found"})

  if(username !== undefined) user.username = username;
  if(bio !== undefined) user.bio = bio;
  if(profileImage !== undefined) user.profileImage = profileImage;
  if(email !== undefined) user.email = email;

  await user.save()
  
  res.status(200).json({message: "profile updated successfully", user: user})

 } catch (error) {
  
   res.status(500).json({message: "error while updating profile", error: error.message})
 }

})

module.exports = router;
