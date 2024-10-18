import { Container } from '@mui/material'
import { useState, useEffect } from 'react'

import socket from '../../utils/socketConnection'
import { Link } from 'react-router-dom'

function SearchDriver({ bookingId }) {
  const [driverInfo, setDriverInfo] = useState(null)

  useEffect(() => {
    // Join a room for the user to receive updates related to their bookings
    socket.emit('join-room', `booking_${bookingId}`)

    socket.on('booking-accepted', (data) => {
      setDriverInfo({
        driver: data.driver,
        driverPhone: data.driverPhone,
        bookingId: data.bookingId,
      })
    })

    return () => {
      socket.off('booking-accepted')
    }
  }, [bookingId])

  return (
    <Container>
      <h1>Booking Status</h1>
      {driverInfo ? (
        <div>
          <h2>Driver Details</h2>
          <p>
            Your booking has been accepted by:{' '}
            <strong>{driverInfo.driver}</strong>
          </p>
          <p>
            Driver contact no.: <strong>{driverInfo.driverPhone}</strong>
          </p>
          <p>Booking ID: {driverInfo.bookingId}</p>
          <Link to={`/track/${bookingId}`}>Track Item</Link>
        </div>
      ) : (
        <p>Waiting for driver to accept the booking...</p>
      )}
    </Container>
  )
}

export default SearchDriver
