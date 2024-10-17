import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import socket from "../../../utils/socketConnection";

function RealtimeTracking({ bookingDetails }) {
  const [location, setLocation] = useState({ lat: null, lng: null });

  useEffect(() => {
    // Start tracking driver location
    socket.on("driver-location", (location) => {
      setLocation(location);
    });

    return () => {
      socket.off("driver-location");
    };
  }, []);

  return (
    <>
      <div>
        <h2>Driver Location</h2>
        {/* Display driver's location on a map */}
        {/* <Map lat={location.lat} lng={location.lng} /> */}
        <p>Latitude: {location.lat}</p>
        <p>Longitude: {location.lng}</p>
      </div>
      <Link to={`tel:${bookingDetails.driver.phone}`}>Call Driver</Link>
    </>
  );
}

export default RealtimeTracking;
