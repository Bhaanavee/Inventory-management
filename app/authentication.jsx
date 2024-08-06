import React, { useState } from 'react';
import { auth } from '@/firebase'; // Adjust path as needed
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { Box, TextField, Button, Typography, Paper } from '@mui/material';
import './style.css';

function Authentication({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false); // State to manage whether to show sign-up or sign-in form

  const handleSignUp = async () => {
    try {
      console.log('Signing up with email:', email);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('User signed up:', userCredential.user);
      setUser(userCredential.user);
    } catch (error) {
      console.error('Error signing up:', error);
    }
  };

  const handleSignIn = async () => {
    try {
      console.log('Signing in with email:', email);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('User signed in:', userCredential.user);
      setUser(userCredential.user);
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      bgcolor="background.paper"
    >
     <Typography variant="h3" className="title">
      WELCOME TO SHELVIFY
    </Typography>
      <br>
      </br>
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          width: '400px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          borderRadius: 2,
          bgcolor: 'white',
        }}
      >
        <Typography variant="h5" color="#333" marginBottom={2}>
          {isSignUp ? 'Sign Up' : 'Sign In'}
        </Typography>
        <TextField
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          sx={{
            marginBottom: 2,
            '& .MuiOutlinedInput-root': {
              '&:hover fieldset': {
                borderColor: '#dda0dd',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#86608e',
              },
            },
          }}
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          sx={{
            marginBottom: 3,
            '& .MuiOutlinedInput-root': {
              '&:hover fieldset': {
                borderColor: '#dda0dd',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#007BFF',
              },
            },
          }}
        />
        {isSignUp ? (
          <>
            <Button onClick={handleSignUp} variant="contained" color="secondary" fullWidth sx={{ marginBottom: 2 }}>
              Sign Up
            </Button>
            <Typography variant="body2" color="#333">
              Already have an account?{' '}
              <Button onClick={() => setIsSignUp(false)} sx={{ color: '#800080' }}>
                Sign In
              </Button>
            </Typography>
          </>
        ) : (
          <>
            <Button onClick={handleSignIn} variant="contained" color="secondary" fullWidth sx={{ marginBottom: 2 }}>
              Sign In
            </Button>
            <Typography variant="body2" color="#333">
              Do not have an account?{' '}
              <Button onClick={() => setIsSignUp(true)} sx={{ color: '#800080' }}>
                Sign Up
              </Button>
            </Typography>
            
          </>
        )}
      </Paper>
    </Box>
  );
}

export default Authentication;
