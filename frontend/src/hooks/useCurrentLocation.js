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

      const intervalId = setInterval(
        updateLocation,
        DRIVER_LOCATION_UPDATE_INTERVAL
      ) // Update location every 5 seconds

      return () => clearInterval(intervalId) // Cleanup interval on component unmount
    }
  }, [])
}
