// DriverJobStatusComponent.js
import { useEffect, useState } from 'react'
import { getData, putData } from '../../../utils/api'
import {
  Box,
  Card,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  styled,
} from '@mui/material'
import { Link, useParams } from 'react-router-dom'
import { JOB_STATUS } from '../../constants'
import useCurrentLocation from '../../hooks/useCurrentLocation'

const StyledCard = styled(Card)(() => {
  return {
    padding: '0.5rem',
    borderRadius: '8px',
  }
})

const JobStatus = () => {
  const { bookingId } = useParams()
  const [bookingDetails, setBookingDetails] = useState(null)
  const [jobStatus, setJobStatus] = useState('')

  useEffect(() => {
    setJobStatus(bookingDetails?.jobStatus)
  }, [bookingDetails?.jobStatus])

  useEffect(() => {
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

  async function updateDriverLocation({ latitude, longitude }) {
    try {
      const response = await putData(
        `http://localhost:8080/api/drivers/location/${bookingId}`,
        { latitude, longitude }
      )

      if (!response.ok) {
        throw new Error('Failed to update driver location')
      }
    } catch (error) {
      console.error('Error updating driver location:', error)
    }
  }

  const handleStatusChange = async (event) => {
    const newStatus = event.target.value
    setJobStatus(newStatus)

    try {
      const response = await putData(
        `http://localhost:8080/api/drivers/bookings/${bookingId}/status`,
        { jobStatus: newStatus }
      )

      const data = await response.json()
      setBookingDetails((prevDetails) => ({
        ...prevDetails,
        jobStatus: data.jobStatus,
      }))
    } catch (error) {
      console.error('Error updating job status:', error)
    }
  }

  useCurrentLocation({ onNewLocation: updateDriverLocation })

  const { pickup, dropoff, user, estimatedCost } = bookingDetails || {}

  return (
    <Container>
      <h1>Driver Dasboard</h1>
      <h2>Current Booking</h2>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <StyledCard raised>
          <h3>Booking Details</h3>
          <p>
            Pickup: <strong>{pickup?.address}</strong>
          </p>
          <p>
            Dropoff: <strong>{dropoff?.address}</strong>
          </p>
          <p>
            Estimated Cost: <strong>${estimatedCost}</strong>
          </p>
        </StyledCard>
        <StyledCard raised>
          <h3>Customer Details</h3>
          {user && (
            <p>
              {user.name} -{' '}
              <Link to={`tel:${user.phone}`}>📞 {user.phone}</Link>
            </p>
          )}
        </StyledCard>
        <StyledCard raised>
          <h3>Update Shipment Status</h3>
          <FormControl fullWidth>
            <InputLabel id="driver-job-status">Status</InputLabel>
            <Select
              labelId="driver-job-status"
              value={jobStatus}
              label="Status"
              onChange={handleStatusChange}
            >
              {Object.values(JOB_STATUS).map((status, index) => (
                <MenuItem key={index} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </StyledCard>
      </Box>
    </Container>
  )
}

export default JobStatus
