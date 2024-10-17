import { Card, Container, styled } from '@mui/material'
import { Link } from 'react-router-dom'

const StyledCard = styled(Card)(() => {
  return {
    padding: '0.5rem',
    borderRadius: '8px',
  }
})

function BookingStatus({ bookingDetails }) {
  const { pickup, dropoff, estimatedCost, driver } = bookingDetails

  return (
    <StyledCard raised>
      <p>
        Source: <strong>{pickup.address}</strong>
      </p>
      <p>
        Destination: <strong>{dropoff.address}</strong>
      </p>
      <p>
        Estimated Cost: <strong>${estimatedCost}</strong>
      </p>
      <h3>Driver Details</h3>
      <p>
        {driver.name} -{' '}
        <Link to={`tel:${driver.phone}`}>📞 {driver.phone}</Link>
      </p>
    </StyledCard>
  )
}

export default BookingStatus
