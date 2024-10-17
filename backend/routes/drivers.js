// routes/drivers.js

const { Router } = require('express')
const router = Router()
const Booking = require('../models/Booking')
const Driver = require('../models/Driver')
const auth = require('../middleware/auth')
const { getIO } = require('../utils/socket')

// Update Driver Location
router.put('/location/:bookingId', auth(), async (req, res) => {
  const { bookingId } = req.params
  const { latitude, longitude } = req.body
  try {
    // TODO: Update driver location in Time Series DB

    const io = getIO()
    // Notify the user that their booking has been accepted
    io.to(`booking_${bookingId}`).emit('driver-location', {
      latitude,
      longitude,
    })

    res.json({ message: 'Location updated' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.put('/accept/:bookingId', auth(), async (req, res) => {
  const { bookingId } = req.params

  try {
    const booking = await Booking.findById(bookingId)

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' })
    }

    // Check if the booking is still available (pending status)
    if (booking.jobStatus !== 'Pending') {
      return res.status(400).json({
        message: 'Booking has already been accepted by another driver',
      })
    }

    // Find the currently authenticated driver
    const driver = await Driver.findOne({ userId: req.user._id })
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' })
    }

    // Assign the driver to the booking and update the status
    booking.driverId = driver._id // Use the driver's ID
    booking.jobStatus = 'Accepted'
    driver.availabilityStatus = 'Busy'

    await booking.save()

    const io = getIO()
    // Notify the user that their booking has been accepted
    io.to(`booking_${bookingId}`).emit('booking-accepted', {
      driver: req.user.name,
      driverPhone: req.user.phone,
      bookingId: booking._id,
    })

    res.status(200).json(booking)
  } catch (err) {
    console.error('Error accepting booking:', err.message)
    res.status(500).json({ message: 'Failed to accept booking' })
  }
})

router.put('/bookings/:bookingId/status', auth(), async (req, res) => {
  try {
    const { bookingId } = req.params
    const { jobStatus } = req.body

    const validStatuses = [
      'Pending',
      'Accepted',
      'En Route to Pickup',
      'Arrived at Pickup Location',
      'Goods Collected',
      'In Transit',
      'Arrived at Drop-off Location',
      'Delivered',
    ]

    if (!validStatuses.includes(jobStatus)) {
      return res.status(400).json({ error: 'Invalid job status' })
    }

    // Find the booking
    const booking = await Booking.findById(bookingId)

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' })
    }

    // Update the job status
    booking.jobStatus = jobStatus

    // Optionally update jobStatus if job is completed
    if (jobStatus === 'En Route to Pickup') booking.pickupTime = new Date()
    if (jobStatus === 'Delivered') {
      booking.deliveryTime = new Date()
      // Set driver available again
      const driver = await Driver.findOne({ userId: req.user._id })
      driver.availabilityStatus = 'Available'
      driver.currentBookingId = null
      await driver.save()
    }

    await booking.save()

    const io = getIO()
    // Emit real-time update to the user
    io.to(`booking_${booking._id}`).emit('job-status-update', {
      jobStatus,
      bookingId: booking._id,
    })

    res.status(200).json(booking)
  } catch (error) {
    console.error('Error updating job status:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

module.exports = router
