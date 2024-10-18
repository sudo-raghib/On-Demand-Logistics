const { Server } = require('socket.io')

let io

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  })

  // Handle socket connection event
  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id)

    socket.on('join-room', (roomId) => {
      socket.join(roomId)
      console.log(`User joined room: ${roomId}`)
    })

    // Handle disconnection event
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id)
    })
  })

  return io
}

const getIO = () => {
  if (!io) {
    throw new Error('Socket.io is not initialized!')
  }
  return io
}

module.exports = { initializeSocket, getIO }
