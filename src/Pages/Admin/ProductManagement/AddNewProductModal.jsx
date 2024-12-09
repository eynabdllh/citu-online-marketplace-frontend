import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
  Box
} from '@mui/material';
import { styled } from '@mui/material/styles';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const AddNewProductModal = ({ open, onClose }) => {
  const [adminUsername, setAdminUsername] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    pdtDescription: '',
    category: '',
    status: 'Available',
    conditionType: '',
    qtyInStock: '',
    buyPrice: '',
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState({ open: false, message: '', type: 'success' });

  useEffect(() => {
    const username = sessionStorage.getItem('username');
    if (username) {
      setAdminUsername(username);
    }
  }, []);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.pdtDescription.trim()) newErrors.pdtDescription = 'Description is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.status) newErrors.status = 'Status is required';
    if (!formData.conditionType) newErrors.conditionType = 'Condition is required';
    if (!formData.qtyInStock) newErrors.qtyInStock = 'Stock quantity is required';
    if (Number(formData.qtyInStock) < 0) newErrors.qtyInStock = 'Stock quantity cannot be negative';
    if (!formData.buyPrice) newErrors.buyPrice = 'Price is required';
    if (Number(formData.buyPrice) <= 0) newErrors.buyPrice = 'Price must be greater than 0';
    if (!selectedFile) newErrors.image = 'Product image is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        // Convert image to base64
        const base64Image = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(selectedFile);
        });

        // Prepare data as JSON
        const submitData = {
          ...formData,
          qtyInStock: Number(formData.qtyInStock),
          buyPrice: Number(formData.buyPrice),
          image: base64Image
        };

        console.log('Submitting data:', {
          ...submitData,
          image: submitData.image ? 'base64_image_data' : null
        });

        const response = await axios.post(
          `http://localhost:8080/api/admin/addproduct/${adminUsername}`,
          submitData,
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );

        if (response.status === 200 || response.status === 201) {
          setNotification({
            open: true,
            message: 'Product added successfully',
            type: 'success'
          });
          onClose();
        }
      } catch (error) {
        console.error('Error details:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        });

        setNotification({
          open: true,
          message: error.response?.data?.message || 
                  error.response?.data || 
                  error.message || 
                  'Error adding product',
          type: 'error'
        });
      }
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>Add New Product</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Admin Username"
                value={adminUsername}
                disabled
                sx={{ bgcolor: 'action.hover' }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Product Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                error={!!errors.name}
                helperText={errors.name}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={formData.pdtDescription}
                onChange={(e) => setFormData({...formData, pdtDescription: e.target.value})}
                error={!!errors.pdtDescription}
                helperText={errors.pdtDescription}
              />
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth required error={!!errors.category}>
                <InputLabel>Category</InputLabel>
                <Select
                  value={formData.category}
                  label="Category"
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  <MenuItem value="Food">Food</MenuItem>
                  <MenuItem value="Clothes">Clothes</MenuItem>
                  <MenuItem value="Accessories">Accessories</MenuItem>
                  <MenuItem value="Stationery or Arts and Crafts">Stationery / Arts and Crafts</MenuItem>
                  <MenuItem value="Merchandise">Merchandise</MenuItem>
                  <MenuItem value="Supplies">Supplies</MenuItem>
                  <MenuItem value="Electronics">Electronics</MenuItem>
                  <MenuItem value="Beauty">Beauty</MenuItem>
                  <MenuItem value="Books">Books</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth required error={!!errors.status}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  label="Status"
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                >
                  <MenuItem value="Available">Available</MenuItem>
                  <MenuItem value="Sold Out">Sold Out</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth required error={!!errors.conditionType}>
                <InputLabel>Condition</InputLabel>
                <Select
                  value={formData.conditionType}
                  label="Condition"
                  onChange={(e) => setFormData({...formData, conditionType: e.target.value})}
                >
                  <MenuItem value="Brand New">Brand New</MenuItem>
                  <MenuItem value="Pre-Loved">Pre-Loved</MenuItem>
                  <MenuItem value="None">None</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <TextField
                required
                fullWidth
                type="number"
                label="Stock Quantity"
                value={formData.qtyInStock}
                onChange={(e) => setFormData({...formData, qtyInStock: e.target.value})}
                error={!!errors.qtyInStock}
                helperText={errors.qtyInStock}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                required
                fullWidth
                type="number"
                label="Price"
                value={formData.buyPrice}
                onChange={(e) => setFormData({...formData, buyPrice: e.target.value})}
                error={!!errors.buyPrice}
                helperText={errors.buyPrice}
              />
            </Grid>

            <Grid item xs={6}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                {selectedFile && (
                  <img
                    src={URL.createObjectURL(selectedFile)}
                    alt="Product preview"
                    style={{ width: 100, height: 100, objectFit: 'cover' }}
                  />
                )}
                <Button
                  component="label"
                  variant="outlined"
                  fullWidth
                  sx={{ 
                    height: '56px',
                    borderColor: errors.image ? '#d32f2f' : '#89343b',
                    color: errors.image ? '#d32f2f' : '#89343b',
                    '&:hover': {
                      borderColor: errors.image ? '#d32f2f' : '#6d2931',
                      backgroundColor: 'rgba(137, 52, 59, 0.04)'
                    }
                  }}
                >
                  {selectedFile ? 'Change Image' : 'Choose Image'}
                  <VisuallyHiddenInput
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files[0]) {
                        setSelectedFile(e.target.files[0]);
                      }
                    }}
                  />
                </Button>
              </Box>
              {errors.image && (
                <Box sx={{ color: '#d32f2f', fontSize: '0.75rem', mt: 1 }}>
                  {errors.image}
                </Box>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ padding: '16px 24px' }}>
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
            Add Product
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setNotification({ ...notification, open: false })}
          severity={notification.type}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AddNewProductModal;
