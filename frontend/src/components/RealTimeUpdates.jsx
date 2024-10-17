import { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:8080");

function RealTimeUpdates() {
  const [status, setStatus] = useState("Pending");

  useEffect(() => {
    socket.on("job-status-update", (newStatus) => {
      setStatus(newStatus);
    });

    return () => {
      socket.off("job-status-update");
    };
  }, []);

  return (
    <div>
      <h1>Job Status Updates</h1>
      <p>Current Status: {status}</p>
    </div>
  );
}

export default RealTimeUpdates;
