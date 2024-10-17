import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import BookingStatus from './BookingStatus'
import RealtimeTracking from './RealtimeTracking'
import { getData } from '../../../utils/api'
import { Chip, Container } from '@mui/material'
import { JOB_STATUS } from '../../constants'
import socket from '../../../utils/socketConnection'

function Tracking() {
  const { bookingId } = useParams()
  const [bookingDetails, setBookingDetails] = useState(null)

  useEffect(() => {
    // Fetch booking details once confirmed
    const fetchBookingDetails = async () => {
      try {
        const response = await getData(
          `http://localhost:8080/api/bookings/${bookingId}`
        )

        const data = await response.json()

        console.log('Booking details:', data)

        setBookingDetails(data)
      } catch (error) {
        console.error('Error fetching booking details:', error)
      }
    }

    fetchBookingDetails()
  }, [bookingId])

  useEffect(() => {
    socket.on('job-status-update', (data) => {
      console.log('USERR: Job status updated:', data)

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
        Booking Status <Chip label={jobStatus} variant="outlined" />
      </h2>

      {jobStatus === JOB_STATUS.IN_TRANSIT ? (
        <RealtimeTracking bookingDetails={bookingDetails} />
      ) : (
        <BookingStatus bookingDetails={bookingDetails} />
      )}
    </Container>
  )
}

export default Tracking
