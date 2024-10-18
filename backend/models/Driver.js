const { Schema, model } = require('mongoose')
const { genSalt, hash, compare } = require('bcrypt')

const driverSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  vehicleType: {
    type: String,
    required: true,
  },
  availabilityStatus: {
    type: String,
    enum: ['Available', 'Busy', 'Offline'],
    default: 'Available',
  },
  currentBookingId: {
    type: Schema.Types.ObjectId,
    ref: 'Booking',
  },
  currentLocation: {
    type: {
      type: String,
      enum: ['Point'],
    },
    coordinates: [Number],
  },
})

driverSchema.index({ currentLocation: '2dsphere' })

// Password hashing
driverSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  const salt = await genSalt(10)
  this.password = await hash(this.password, salt)
  next()
})

// Password verification
driverSchema.methods.matchPassword = async function (enteredPassword) {
  return await compare(enteredPassword, this.password)
}

const Driver = model('Driver', driverSchema)

module.exports = Driver
