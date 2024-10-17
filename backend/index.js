// index.js

const express = require('express')
const { createServer } = require('http')
const socketIo = require('socket.io')
const cors = require('cors')

const connectDB = require('./config/db')
const Booking = require('./models/Booking')
const userRoutes = require('./routes/users')
const driverRoutes = require('./routes/drivers')
const bookingRoutes = require('./routes/bookings')
const adminRoutes = require('./routes/admin')
const cron = require('node-cron')
const { updateDemandData } = require('./services/DemandUpdater')

const { initializeSocket } = require('./utils/socket')

const app = express()
const server = createServer(app)
// Initialize socket.io
const io = initializeSocket(server)

// Connect to MongoDB
connectDB()

// Middleware
app.use(cors())
app.use(express.json())

// Routes

app.use('/api/users', userRoutes)
app.use('/api/drivers', driverRoutes)
app.use('/api/bookings', bookingRoutes)
app.use('/api/admin', adminRoutes)

// Schedule the task every 5 minutes
cron.schedule('*/5 * * * *', () => {
  console.log('Updating demand data...')
  updateDemandData().catch((error) =>
    console.error('Error updating demand data:', error)
  )
})

const PORT = process.env.PORT || 8080
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
