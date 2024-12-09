import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Box,
  Alert
} from '@mui/material';
import axios from 'axios';

const AddUserModal = ({ open, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    password: '',
    address: '',
    contactNo: '',
    email: ''
  });

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    
    if (!formData.contactNo.trim()) {
      newErrors.contactNo = 'Contact number is required';
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/api/seller/postSellerRecord', {
        username: formData.username,
        firstName: formData.firstName,
        lastName: formData.lastName,
        password: formData.password,
        address: formData.address,
        contactNo: formData.contactNo,
        email: formData.email
      });
      
      if (response.status === 200) {
        onAdd(response.data);
        onClose();
        setFormData({
          username: '',
          firstName: '',
          lastName: '',
          password: '',
          address: '',
          contactNo: '',
          email: ''
        });
        setErrors({});
      }
    } catch (error) {
      setSubmitError(error.response?.data?.message || 'Failed to add seller. Please try again.');
    }
  };

  const handleChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Seller</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {submitError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {submitError}
            </Alert>
          )}
          
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Username"
                value={formData.username}
                onChange={handleChange('username')}
                error={!!errors.username}
                helperText={errors.username}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                value={formData.firstName}
                onChange={handleChange('firstName')}
                error={!!errors.firstName}
                helperText={errors.firstName}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                value={formData.lastName}
                onChange={handleChange('lastName')}
                error={!!errors.lastName}
                helperText={errors.lastName}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="password"
                label="Password"
                value={formData.password}
                onChange={handleChange('password')}
                error={!!errors.password}
                helperText={errors.password}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                multiline
                rows={3}
                value={formData.address}
                onChange={handleChange('address')}
                error={!!errors.address}
                helperText={errors.address}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Contact Number"
                value={formData.contactNo}
                onChange={handleChange('contactNo')}
                error={!!errors.contactNo}
                helperText={errors.contactNo}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                value={formData.email}
                onChange={handleChange('email')}
                error={!!errors.email}
                helperText={errors.email}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2.5 }}>
        <Button 
          onClick={onClose}
          variant="outlined"
          sx={{ 
            borderColor: '#89343b',
            color: '#89343b',
            '&:hover': {
              borderColor: '#6d2931',
              backgroundColor: 'rgba(137, 52, 59, 0.04)'
            }
          }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit}
          variant="contained"
          sx={{ 
            bgcolor: '#89343b',
            '&:hover': { bgcolor: '#6d2931' },
            ml: 2
          }}
        >
          Add Seller
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddUserModal;