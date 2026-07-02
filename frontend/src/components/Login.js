import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Box } from '@mui/material';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      navigate('/dashboard');
    } catch (err) {
      alert('Login failed');
    }
  };

  const handleRegister = async () => {
    navigate('/register');
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      maxWidth={300}
      margin="auto"
      padding={2}
    >
      <h2>Login</h2>
      <TextField label="Email" variant="outlined" margin="normal" onChange={(e) => setEmail(e.target.value)} />
      <TextField label="Password" type="password" variant="outlined" margin="normal" onChange={(e) => setPassword(e.target.value)} />
      <Button variant="contained" color="primary" style={{ marginTop: 16 }} onClick={handleLogin}>Login</Button>
      <Button variant="contained" color="primary" style={{ marginTop: 16 }} onClick={handleRegister}>Register</Button>
    </Box>
  );
}

export default Login;