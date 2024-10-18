import { useEffect, useState } from 'react'
import { Box, Button, Card, Container, styled } from '@mui/material'
import { useNavigate } from 'react-router-dom'

import Socket from '../../../utils/socketConnection'
import { putData } from '../../../utils/api'

const StyledCard = styled(Card)(() => {
  return {
    padding: '0.5rem',
    borderRadius: '8px',
  }
})

const DriverDashboard = () => {
  // State to store booking requests
  const [bookingRequests, setBookingRequests] = useState([])
  const navigate = useNavigate()

  const displayBookingToDriver = (booking) => {
    setBookingRequests((prevBookings) => [...prevBookings, booking])
  }

  useEffect(() => {
    // Listen for 'new-booking-request' event
    Socket.on('new-booking-request', (booking) => {
      displayBookingToDriver(booking)
    })

    return () => {
      Socket.off('new-booking-request')
    }
  }, [])

  const handleAcceptBooking = async (bookingId) => {
    try {
      const response = await putData(
        `http://localhost:8080/api/drivers/accept/${bookingId}`
      )

      if (!response.ok) {
        throw new Error('Failed to accept booking')
      }

      // Remove the accepted booking from the list
      setBookingRequests((prevRequests) =>
        prevRequests.filter((req) => req._id !== bookingId)
      )
      navigate(`/job/${bookingId}`)
    } catch (error) {
      console.error('Error accepting booking:', error)
    }
  }

  const handleRejectBooking = (bookingId) => {
    // TODO: implement a reject API call
    setBookingRequests((prevRequests) =>
      prevRequests.filter((req) => req._id !== bookingId)
    )
  }

  return (
    <Container>
      <h1>Driver Dasboard</h1>
      <h2>Available Booking Requests</h2>
      {bookingRequests.length === 0 ? (
        <p>No booking requests available</p>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {bookingRequests.map((booking) => (
            <StyledCard raised key={booking._id} sx={{ padding: '1rem' }}>
              <p>
                Pickup: {booking.pickup.address} <br />
                Dropoff: {booking.dropoff.address} <br />
                Item Weight: {booking.itemWeight} kg <br />
                Estimated Cost: ${booking.estimatedCost}
              </p>
              <Button
                onClick={() => handleAcceptBooking(booking._id)}
                variant="contained"
              >
                Accept Booking
              </Button>
              <Button onClick={() => handleRejectBooking(booking._id)}>
                Reject Booking
              </Button>
            </StyledCard>
          ))}
        </Box>
      )}
    </Container>
  )
}

export default DriverDashboard
