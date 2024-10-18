const express = require('express')
const router = express.Router()
const User = require('../models/User')
const Driver = require('../models/Driver')
const { sign } = require('jsonwebtoken')

// Register User
router.post('/register', async (req, res) => {
  try {
    const { name, phone, password, role, vehicleType } = req.body

    const existingUser = await User.findOne({ phone })
    if (existingUser)
      return res.status(400).json({ message: 'Phone already in use' })

    const user = new User({ name, phone, password, role })
    const savedUser = await user.save()

    // If role is 'driver', create an entry in the Driver model
    if (role === 'driver') {
      const newDriver = new Driver({
        userId: savedUser._id,
        vehicleType,
      })

      await newDriver.save()
    }

    const token = sign({ id: user._id }, 'your_jwt_secret', {
      expiresIn: '7d',
    })

    res.json({
      message: 'User registered',
      token,
      userId: user._id,
      userRole: role,
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// User Login
router.post('/login', async (req, res) => {
  try {
    const { phone, password } = req.body

    const user = await User.findOne({ phone })

    if (!user) return res.status(400).json({ message: 'Invalid credentials' })

    const isMatch = await user.matchPassword(password)

    if (!isMatch)
      return res.status(400).json({ message: 'Invalid credentials' })

    const token = sign({ id: user._id }, 'your_jwt_secret', {
      expiresIn: '7d',
    })

    res.json({
      message: 'Login successful',
      token,
      userId: user._id,
      userRole: user.role,
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
