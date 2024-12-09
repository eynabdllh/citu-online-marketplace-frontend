import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import {
    Grid,
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    InputAdornment,
    Alert,
} from '@mui/material';
import { Person, Email, Lock, LocationOn, Phone, AccountCircle } from '@mui/icons-material';
import logo from '../../assets/img/logocit-1.png';
import cit from '../../assets/img/cit-1.jpg';

const Register = () => {
    const [newSeller, setNewSeller] = useState({
        username: '',
        password: '',
        firstName: '',
        lastName: '',
        address: '',
        contactNo: '',
        email: '',
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // Create a new seller
    const createSeller = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Check if all fields are filled
        if (
            !newSeller.username ||
            !newSeller.password ||
            !newSeller.firstName ||
            !newSeller.lastName ||
            !newSeller.address ||
            !newSeller.contactNo ||
            !newSeller.email
        ) {
            setErrorMessage('All fields are required. Please fill out the entire form.');
            setIsLoading(false);
            return;
        }

        // Password validation
        if (newSeller.password.length < 8) {
            setErrorMessage('Password must be at least 8 characters long.');
            setIsLoading(false);
            return;
        }

        // Contact number validation
        if (newSeller.contactNo.length < 11) {
            setErrorMessage('Please enter a valid phone number.');
            setIsLoading(false);
            return;
        }

        try {
            // Attempt to create seller by sending the data to the server
            const response = await axios.post('http://localhost:8080/api/seller/postSellerRecord', newSeller);
            setErrorMessage('');
            setNewSeller({
                username: '',
                password: '',
                firstName: '',
                lastName: '',
                address: '',
                contactNo: '',
                email: '',
            });
            navigate('/');
        } catch (error) {
            if (error.response && error.response.data.message) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage('An unexpected error occurred. Please try again later.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Grid container sx={{ minHeight: '100vh' }}>
            {/* Left Side: Image */}
            <Grid
                item
                xs={12}
                md={6}
                sx={{
                    backgroundImage: `url(${cit})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: { xs: 'none', md: 'block' },
                    position: 'relative',
                }}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    }}
                />
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: '10%',
                        left: '10%',
                        color: '#fff',
                        zIndex: 1,
                    }}
                >
                    <Typography variant="h3" fontWeight="bold">
                        Join the CIT-U Marketplace
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 2 }}>
                        Connect with your campus community and start selling today!
                    </Typography>
                </Box>
            </Grid>

            {/* Right Side: Registration Form */}
            <Grid
                item
                xs={12}
                md={6}
                display="flex"
                alignItems="center"
                justifyContent="center"
                sx={{
                    padding: { xs: 4, md: 8 },
                }}
            >
                <Paper
                    elevation={6}
                    sx={{
                        maxWidth: 500,
                        width: '100%',
                        p: 4,
                        borderRadius: 3,
                        textAlign: 'center',
                        backgroundColor: '#fff',
                    }}
                >
                    <Box sx={{ mb: 4 }}>
                        <img src={logo} alt="Logo" style={{ maxWidth: '120px' }} />
                    </Box>
                    <Typography variant="h4" fontWeight="bold" color="text.primary" sx={{ mb: 2 }}>
                        Create Your Account
                    </Typography>
                    {errorMessage && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {errorMessage}
                        </Alert>
                    )}
                    <form onSubmit={createSeller}>
                        <TextField
                            fullWidth
                            label="Username"
                            value={newSeller.username}
                            onChange={(e) => setNewSeller({ ...newSeller, username: e.target.value })}
                            sx={{ mb: 2 }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <AccountCircle color="white" />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            fullWidth
                            label="First Name"
                            value={newSeller.firstName}
                            onChange={(e) => setNewSeller({ ...newSeller, firstName: e.target.value })}
                            sx={{ mb: 2 }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Person color="white" />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            fullWidth
                            label="Last Name"
                            value={newSeller.lastName}
                            onChange={(e) => setNewSeller({ ...newSeller, lastName: e.target.value })}
                            sx={{ mb: 2 }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Person color="white" />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            fullWidth
                            label="Address"
                            value={newSeller.address}
                            onChange={(e) => setNewSeller({ ...newSeller, address: e.target.value })}
                            sx={{ mb: 2 }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LocationOn color="white" />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            fullWidth
                            label="Contact No"
                            value={newSeller.contactNo}
                            onChange={(e) => setNewSeller({ ...newSeller, contactNo: e.target.value })}
                            sx={{ mb: 2 }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Phone color="white" />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            fullWidth
                            label="Email"
                            type="email"
                            value={newSeller.email}
                            onChange={(e) => setNewSeller({ ...newSeller, email: e.target.value })}
                            sx={{ mb: 2 }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Email color="white" />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            fullWidth
                            label="Password"
                            type="password"
                            value={newSeller.password}
                            onChange={(e) => setNewSeller({ ...newSeller, password: e.target.value })}
                            sx={{ mb: 3 }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Lock color="white" />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            disabled={isLoading}
                            sx={{
                                backgroundColor: '#8A252C',
                                py: 1.5,
                                borderRadius: '25px',
                                fontWeight: 'bold',
                                fontSize: '1rem',
                            }}
                        >
                            {isLoading ? 'Registering...' : 'Register'}
                        </Button>
                    </form>
                    <Typography variant="body2" sx={{ mt: 2 }}>
                        Already have an account?{' '}
                        <RouterLink to="/" style={{ textDecoration: 'none', color: '#8A252C', fontWeight: 'bold' }}>
                            Login
                        </RouterLink>
                    </Typography>
                </Paper>
            </Grid>
        </Grid>
    );
};

export default Register;
