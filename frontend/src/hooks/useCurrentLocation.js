import { useEffect } from 'react'
import { DRIVER_LOCATION_UPDATE_INTERVAL } from '../constants'

export default function useCurrentLocation({ onNewLocation }) {
  useEffect(() => {
    if (navigator.geolocation) {
      async function updateLocation() {
        try {
          navigator.geolocation.getCurrentPosition(async (position) => {
            console.log('Driver current location:', position.coords)
            await onNewLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            })
          })
        } catch (error) {
          console.error('Error getting current location:', error)
        }
      }

      const intervalId = setInterval(updateLocation, 5000) // Update location every 1 minute

      return () => clearInterval(intervalId) // Cleanup interval on component unmount
    }
  }, [])
}
