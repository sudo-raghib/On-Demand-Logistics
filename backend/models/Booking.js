const { Schema, model } = require('mongoose')

const bookingSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  driverId: {
    type: Schema.Types.ObjectId,
    ref: 'Driver',
  },
  pickup: {
    address: String,
    coordinates: [Number],
  },
  dropoff: {
    address: String,
    coordinates: [Number],
  },
  vehicleType: {
    type: String,
  },
  estimatedCost: {
    type: Number,
    required: true,
  },
  jobStatus: {
    type: String,
    enum: [
      'Pending',
      'Accepted',
      'En Route to Pickup',
      'Arrived at Pickup Location',
      'Goods Collected',
      'In Transit',
      'Arrived at Drop-off Location',
      'Delivered',
    ],
    default: 'Pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  pickupTime: Date,
  deliveryTime: Date,
})

const Booking = model('Booking', bookingSchema)

module.exports = Booking
