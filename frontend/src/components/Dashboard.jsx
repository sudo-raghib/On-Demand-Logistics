import { useEffect, useState } from 'react'
import { Container } from '@mui/material'
import { useNavigate } from 'react-router-dom'

import DriverDashboard from './Driver/DriverDashboard'

const Dashboard = () => {
  const [userType, setUserType] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    setUserType(localStorage.getItem('userType'))
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userType')
    navigate('/')
  }

  if (userType === 'driver') {
    return <DriverDashboard />
  }

  return (
    <Container>
      <h2>Welcome, {userType}</h2>
      <p>This is the {userType} dashboard.</p>
      <button onClick={handleLogout}>Logout</button>
    </Container>
  )
}

export default Dashboard
