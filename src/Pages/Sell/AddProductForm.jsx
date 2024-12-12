import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Box, MenuItem, Select, FormControl, InputLabel, Modal, Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom'; 
import '../../App.css';
import { toast } from "react-hot-toast";

const AddProductForm = ({ open, handleClose }) => { 
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [category, setCategory] = useState('');
  const [conditionType, setConditionType] = useState('');
  const [sellerUsername, setSellerUsername] = useState('');
  const [sellerInfo, setSellerInfo] = useState(null); 
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [status, setStatus] = useState('');

  useEffect(() => {
    const username = sessionStorage.getItem('username');
    if (username) {
      setSellerUsername(username); 
      axios.get(`http://localhost:8080/api/seller/getUsername/${username}`)
        .then(response => {
          setSellerInfo(response.data); 
        })
        .catch(error => {
          console.error('Error fetching seller information:', error);
          alert('Could not retrieve seller data');
        });
    } else {
      navigate('/login');  
    }
  }, [navigate]);

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate negative numbers
    if (Number(price) <= 0) {
        toast.error('Price must be greater than 0');
        return;
    }

    if (Number(quantity) <= 0) {
        toast.error('Quantity must be greater than 0');
        return;
    }

    if (!productName || !description || !quantity || !price || !category || !conditionType || !imageFile || !status) {
        toast.error('All fields must be filled in');
        return;
    }

    const formData = new FormData();
    formData.append('name', productName);
    formData.append('pdtDescription', description);
    formData.append('qtyInStock', quantity);
    formData.append('buyPrice', price);
    formData.append('category', category);
    formData.append('status', status);
    formData.append('conditionType', conditionType);
    formData.append('seller_username', sellerUsername); 

    if (imageFile) {
      formData.append('image', imageFile);
    } else {
      setSnackbar({
        open: true,
        message: 'No image selected',
        severity: 'error'
      });
      return;
    }

    try {
      await axios.post('/api/product/postproduct', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',  
        }
      });

      // Reset all form fields
      setProductName('');
      setDescription('');
      setQuantity('');
      setPrice('');
      setCategory('');
      setConditionType('');
      setImageFile(null);
      setStatus('');

      toast.success('Product added successfully!');
      handleClose(); 
      navigate('/buy');  
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error(error.response?.data?.message || 'Failed to add product');
    }
  };

  return (
    <>
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'white',
            p: 4,
            borderRadius: 2,
            boxShadow: 24,
            width: '90%',
            maxWidth: 500,
            maxHeight: '90vh', 
            overflowY: 'auto', 
          }}
        >
          <Typography variant="h5" sx={{ fontSize:'30px', fontWeight: 'bold', mb: 2, color: '#89343b', justifyContent:'center', display:'flex' }}>
            Add New Product
          </Typography>
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Product Name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel shrink>Category</InputLabel>
              <Select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                displayEmpty
                sx={{ 
                  color: category ? 'inherit' : '#A9A9A9'
                }}
              >
                <MenuItem value="" disabled>Select a category</MenuItem>
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
            <FormControl fullWidth margin="normal">
              <InputLabel shrink>Status</InputLabel>
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                required
                displayEmpty
                sx={{ 
                  color: status ? 'inherit' : '#A9A9A9'
                }}
              >
                <MenuItem value="" disabled>Select status</MenuItem>
                <MenuItem value="Available">Pending</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel shrink>Condition</InputLabel>
              <Select
                value={conditionType}
                onChange={(e) => setConditionType(e.target.value)}
                required
                displayEmpty
                sx={{ 
                  color: conditionType ? 'inherit' : '#A9A9A9'
                }}
              >
                <MenuItem value="" disabled>Select condition</MenuItem>
                <MenuItem value="Brand New">Brand New</MenuItem>
                <MenuItem value="Pre-Loved">Pre-Loved</MenuItem>
                <MenuItem value="None">None</MenuItem>
              </Select>
            </FormControl>
            <TextField
              margin="normal"
              required
              fullWidth
              type="number"
              label="Quantity in Stock"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: "1" }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              type="number"
              label="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: "1" }}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Seller Username"
              value={sellerUsername}
              InputProps={{
                readOnly: true,
              }}
              InputLabelProps={{ shrink: true }}
              sx={{ bgcolor: '#f5f5f5' }}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel shrink htmlFor="image-upload">Product Image</InputLabel>
              <Box
                sx={{
                  mt: 1,
                  p: 2,
                  border: '1px dashed #ccc',
                  borderRadius: '4px',
                  textAlign: 'center',
                  cursor: 'pointer'
                }}
                onClick={() => document.getElementById('image-upload').click()}
              >
                {imageFile ? (
                  <div>
                    <div>Selected: {imageFile.name}</div>
                    <img 
                      src={URL.createObjectURL(imageFile)} 
                      alt="Preview" 
                      style={{ maxWidth: '200px', maxHeight: '200px', marginTop: '8px' }}
                    />
                  </div>
                ) : (
                  <div>Click to upload image</div>
                )}
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])}
                  style={{ display: 'none' }}
                  required
                />
              </Box>
            </FormControl>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 3, bgcolor: '#89343b', '&:hover': { bgcolor: '#ffd700', color: '#89343b' } }}
            >
              Add Product
            </Button>
          </Box>
        </Box>
      </Modal>
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={3000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{
            backgroundColor: snackbar.severity === 'success' ? '#89343b' : undefined,
            color: snackbar.severity === 'success' ? 'white' : undefined,
            '& .MuiAlert-icon': {
              color: snackbar.severity === 'success' ? 'white' : undefined
            }
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AddProductForm;