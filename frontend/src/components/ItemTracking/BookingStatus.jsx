import { Container } from '@mui/material'
import { Link } from 'react-router-dom'

function BookingStatus({ bookingDetails }) {
  const { pickup, dropoff, estimatedCost, driver } = bookingDetails

  return (
    <Container>
      <p>
        Source: <strong>{pickup.address}</strong>
      </p>
      <p>
        Destination: <strong>{dropoff.address}</strong>
      </p>
      <p>
        <strong>Estimated Cost:</strong> ${estimatedCost}
      </p>
      <h3>Driver Details</h3>
      <p>
        {driver.name} -{' '}
        <Link to={`tel:${driver.phone}`}>📞 {driver.phone}</Link>
      </p>
    </Container>
  )
}

export default BookingStatus
