const { Router } = require('express')
const router = Router()
const Booking = require('../models/Booking')
const auth = require('../middleware/auth')
const { calculatePrice } = require('../services/PricingService')
const MatchingService = require('../services/MatchingService')
const { getIO } = require('../utils/socket')

router.post('/get-estimate', auth(), async (req, res) => {
  const { pickup, dropoff, itemWeight, vehicleType } = req.body

  try {
    const estimatedCost = await calculatePrice(
      pickup,
      dropoff,
      vehicleType,
      itemWeight
    )
    res.status(200).json({
      estimatedCost: estimatedCost,
    })
  } catch (error) {
    console.error('Error in booking request:', error)
    res.status(500).json({ message: 'Error processing booking request' })
  }
})

router.post('/request', auth(), async (req, res) => {
  const { pickup, dropoff, itemWeight, vehicleType } = req.body

  try {
    const estimatedCost = await calculatePrice(
      pickup,
      dropoff,
      vehicleType,
      itemWeight
    )

    const booking = new Booking({
      userId: req.user._id,
      pickup,
      dropoff,
      estimatedCost,
      itemWeight,
      vehicleType,
      jobStatus: 'Pending',
    })

    await booking.save()

    const io = getIO()
    // Emit event to available drivers about new booking
    io.emit('new-booking-request', booking)

    res.status(201).json({ bookingId: booking._id })
  } catch (err) {
    console.error('Error requesting booking:', err.message)
    res.status(500).json({ message: 'Failed to create booking' })
  }
})

// Get Booking Details
router.get('/:bookingId', auth(), async (req, res) => {
  const { bookingId } = req.params
  try {
    const booking = await Booking.findById(bookingId)
      .select(
        'pickup dropoff itemWeight estimatedCost jobStatus driverId userId'
      )
      .populate([
        {
          path: 'driverId',
          populate: {
            path: 'userId',
            select: 'name phone',
          },
        },
        {
          path: 'userId',
          select: 'name phone',
        },
      ])

    if (!booking) return res.status(404).json({ message: 'Booking not found' })

    res.json({
      id: booking._id,
      driver: {
        name: booking.driverId.userId.name,
        phone: booking.driverId.userId.phone,
      },
      user: {
        name: booking.userId.name,
        phone: booking.userId.phone,
      },
      pickup: booking.pickup,
      dropoff: booking.dropoff,
      estimatedCost: booking.estimatedCost,
      itemWeight: booking.itemWeight,
      jobStatus: booking.jobStatus,
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
