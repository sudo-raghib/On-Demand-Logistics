import { useState } from 'react'
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
  styled,
} from '@mui/material'
import { VEHICLE_TYPES } from '../constants'
import { API_BASE_URL } from '../../utils/config'

const StyledForm = styled('form')(() => {
  return {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: '2rem',
  }
})

const CenteredHeading = styled('h2')(() => {
  return {
    textAlign: 'center',
  }
})

const Signup = () => {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [userType, setUserType] = useState('user')
  const [vehicleType, setVehicleType] = useState('car')
  const navigate = useNavigate()

  const handleSignup = async (e) => {
    e.preventDefault()

    try {
      const response = await postData(
        `${API_BASE_URL}/users/register`,
        {
          name,
          phone,
          password,
          role: userType,
          vehicleType,
        },
        false
      )

      const data = await response.json()
      const { token, userRole } = data

      localStorage.setItem('token', token)
      localStorage.setItem('userType', userRole)

      navigate('/')
    } catch (error) {
      console.error('Signup failed, please try again.', error)
    }
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
        }}
      >
        <CenteredHeading>Sign Up</CenteredHeading>
        <StyledForm className="flex" onSubmit={handleSignup}>
          <FormControl fullWidth>
            <Input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </FormControl>
          <FormControl fullWidth>
            <Input
              type="tel"
              placeholder="Mobile No."
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </FormControl>
          <FormControl fullWidth>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id="user-type">User Type</InputLabel>
            <Select
              labelId="user-type"
              label="User Type"
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
            >
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="driver">Driver</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>
          {userType === 'driver' && (
            <FormControl fullWidth>
              <InputLabel id="vehicle-type">Vehicle Type</InputLabel>
              <Select
                labelId="vehicle-type"
                label="Vehicle Type"
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
              >
                {VEHICLE_TYPES.map((vehicle, index) => {
                  return (
                    <MenuItem key={index} value={vehicle}>
                      {vehicle}
                    </MenuItem>
                  )
                })}
              </Select>
            </FormControl>
          )}
          <FormControl fullWidth>
            <Button variant="contained" type="submit">
              SignUp
            </Button>
          </FormControl>
        </StyledForm>
      </Box>
    </Box>
  )
}

export default Signup
