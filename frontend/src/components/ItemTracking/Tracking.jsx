import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import BookingStatus from './BookingStatus'
import RealtimeTracking from './RealtimeTracking'
import { getData } from '../../../utils/api'
import { Box, Chip, Container } from '@mui/material'
import socket from '../../../utils/socketConnection'
import { API_BASE_URL } from '../../../utils/config'

function Tracking() {
  const { bookingId } = useParams()
  const [bookingDetails, setBookingDetails] = useState(null)

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const response = await getData(
          `${API_BASE_URL}/bookings/${bookingId}`
        )

        const data = await response.json()

        setBookingDetails(data)
      } catch (error) {
        console.error('Error fetching booking details:', error)
      }
    }

    fetchBookingDetails()
  }, [bookingId])

  useEffect(() => {
    socket.on('job-status-update', (data) => {
      setBookingDetails((prevDetails) => ({
        ...prevDetails,
        jobStatus: data.jobStatus,
      }))
    })
  }, [])

  if (!bookingDetails) {
    return <div>Loading...</div>
  }

  const { jobStatus } = bookingDetails

  return (
    <Container>
      <h2>
        Booking Status{' '}
        <Chip
          sx={{ backgroundColor: '#04D4F0' }}
          label={jobStatus}
          variant="outlined"
        />
      </h2>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <BookingStatus bookingDetails={bookingDetails} />
        <RealtimeTracking bookingDetails={bookingDetails} />
      </Box>
    </Container>
  )
}

export default Tracking
