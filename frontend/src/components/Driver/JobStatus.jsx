// DriverJobStatusComponent.js
import { useEffect, useState } from 'react'
import { getData, putData } from '../../../utils/api'
import {
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material'
import { Link, useParams } from 'react-router-dom'
import { JOB_STATUS } from '../../constants'

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

  const { pickup, dropoff, user, estimatedCost } = bookingDetails || {}

  return (
    <Container>
      <h1>Current Booking</h1>
      <Container>
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
      </Container>
      <Container>
        <h3>Customer Information</h3>
        {user && (
          <p>
            {user.name} - <Link to={`tel:${user.phone}`}>📞 {user.phone}</Link>
          </p>
        )}
      </Container>
      <Container>
        <h3>Update Status</h3>
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
      </Container>
    </Container>
  )
}

export default JobStatus
