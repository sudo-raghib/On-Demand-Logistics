import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input, Button, FormControl, Box, styled } from "@mui/material";
import { postData } from "../../utils/api";

const StyledForm = styled("form")(() => {
  return {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    gap: "2rem",
  };
});

const CenteredHeading = styled("h2")(() => {
  return {
    textAlign: "center",
  };
});

const Login = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await postData(
        "http://localhost:8080/api/users/login",
        {
          phone,
          password,
        },
        false
      );

      const data = await response.json();
      const { userRole, token } = data;

      // Store token and userType in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("userType", userRole);

      navigate("/");
    } catch (error) {
      console.error("Login failed, please try again.", error);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Box
        sx={{
          width: "30%",
        }}
      >
        <CenteredHeading>Login</CenteredHeading>
        <StyledForm className="flex" onSubmit={handleLogin}>
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
            <Button variant="contained" type="submit">
              Login
            </Button>
          </FormControl>
        </StyledForm>
        <p>
          Dont have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </Box>
    </Box>
  );
};

export default Login;