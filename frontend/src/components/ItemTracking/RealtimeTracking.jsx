import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, styled } from '@mui/material'

import socket from '../../../utils/socketConnection'

const StyledCard = styled(Card)(() => {
  return {
    padding: '0.5rem',
    borderRadius: '8px',
  }
})

function RealtimeTracking({ bookingDetails }) {
  const [location, setLocation] = useState({ latitude: null, longitude: null })

  useEffect(() => {
    socket.on('driver-location', (location) => {
      console.log('Updated Driver location:', location)
      setLocation(location)
    })

    return () => {
      socket.off('driver-location')
    }
  }, [])

  return (
    <StyledCard raised>
      <div>
        <h2>Driver Realtime Location Tracking</h2>
        {/* TODO: Show driver's location on a map */}
        <p>
          <strong>Latitude:</strong> {location.latitude || 'Loading...'}
        </p>
        <p>
          <strong>Longitude:</strong> {location.longitude || 'Loading...'}
        </p>
      </div>
    </StyledCard>
  )
}

export default RealtimeTracking
