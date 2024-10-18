import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { postData } from '../../utils/api'
import {
  Box,
  Button,
  FormControl,
  Input,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material'
import SearchDriver from './SearchDriver'
import { VEHICLE_TYPES } from '../constants'

// Dummy coordinates
const dummyCoordinates = {
  pickup: [28.7041, 77.1025],
  dropoff: [19.076, 72.8777],
}

function BookingForm() {
  const [pickup, setPickup] = useState('')
  const [dropoff, setDropoff] = useState('')
  const [itemWeight, setItemWeight] = useState('')
  const [estimatedCost, setEstimatedCost] = useState(null)
  const [vehicleType, setVehicleType] = useState('')
  const [loading, setLoading] = useState(false)
  const [bookingId, setBookingId] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const userType = localStorage.getItem('userType')

    if (userType !== 'user') {
      navigate('/dashboard')
    }
  }, [navigate])

  // request for estimated cost
  const handleGetEstimate = async () => {
    try {
      setLoading(true)

      const response = await postData(
        'http://localhost:8080/api/bookings/get-estimate',
        {
          pickup: {
            address: pickup,
            coordinates: dummyCoordinates.pickup,
          },
          dropoff: {
            address: dropoff,
            coordinates: dummyCoordinates.dropoff,
          },
          itemWeight,
          vehicleType,
        }
      )

      const data = await response.json()

      if (data.message) {
        alert(data.message)
        return
      }

      setEstimatedCost(data.estimatedCost)
    } catch (error) {
      console.error('Failed to request booking', error)
    } finally {
      setLoading(false)
    }
  }

  // confirm the booking, and request a driver
  const handleConfirmBooking = async () => {
    try {
      setLoading(true)

      const response = await postData(
        'http://localhost:8080/api/bookings/request',
        {
          pickup: {
            address: pickup,
            coordinates: dummyCoordinates.pickup,
          },
          dropoff: {
            address: dropoff,
            coordinates: dummyCoordinates.dropoff,
          },
          itemWeight: parseInt(itemWeight),
          vehicleType,
        }
      )

      const data = await response.json()
      setBookingId(data.bookingId)
    } catch (error) {
      console.error('Failed to confirm booking', error)
    } finally {
      setLoading(false)
    }
  }

  const changeRequestBooking = (e, setValue) => {
    setEstimatedCost(null)
    setValue(e.target.value)
  }

  if (bookingId) {
    return <SearchDriver bookingId={bookingId} />
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <Box
        sx={{
          width: '30%',
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem',
        }}
      >
        <h1>Book a Vehicle</h1>
        <FormControl fullWidth>
          <Input
            type="text"
            placeholder="Pickup Location"
            value={pickup}
            onChange={(e) => changeRequestBooking(e, setPickup)}
          />
        </FormControl>
        <FormControl fullWidth>
          <Input
            type="text"
            placeholder="Dropoff Location"
            value={dropoff}
            onChange={(e) => changeRequestBooking(e, setDropoff)}
          />
        </FormControl>
        <FormControl fullWidth>
          <Input
            type="number"
            placeholder="Item Weight (kg)"
            value={itemWeight}
            onChange={(e) => changeRequestBooking(e, setItemWeight)}
          />
        </FormControl>
        <FormControl fullWidth>
          <InputLabel id="booking-vehicle">Vehicle Type</InputLabel>
          <Select
            labelId="booking-vehicle"
            value={vehicleType}
            label="Vehicle Type"
            onChange={(e) => changeRequestBooking(e, setVehicleType)}
          >
            {VEHICLE_TYPES.map((vehicle, index) => (
              <MenuItem key={index} value={vehicle}>
                {vehicle}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {!estimatedCost ? (
          <Button onClick={handleGetEstimate} disabled={loading}>
            {loading ? 'Calculating...' : 'Get Estimated Cost'}
          </Button>
        ) : (
          <>
            <p>Estimated Cost: ${estimatedCost}</p>
            <Button onClick={handleConfirmBooking} disabled={loading}>
              {loading ? 'Confirming...' : 'Confirm Booking'}
            </Button>
          </>
        )}
      </Box>
    </Box>
  )
}

export default BookingForm
