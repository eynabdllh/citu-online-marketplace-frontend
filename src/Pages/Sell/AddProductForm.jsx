import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Container, Typography, Box, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom'; 
import '../../App.css';

const AddProductForm = () => {
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [conditionType, setConditionType] = useState('');
  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', productName);
    formData.append('pdtDescription', description);
    formData.append('qtyInStock', quantity);
    formData.append('buyPrice', price);
    formData.append('category', category);
    formData.append('status', status);
    formData.append('conditionType', conditionType);
  
    if (imageFile) {
      formData.append('image', imageFile);
    } else {
      alert('No image selected.');
      return;
    }
  
    try {
        const response = await axios.post('http://localhost:8080/api/product/postproduct', formData);
        alert(response.data);
        navigate('/'); 
      } catch (error) {
        console.error('Error adding product:', error);
        if (error.response) {
          console.error('Response data:', error.response.data);
          console.error('Response status:', error.response.status);
          alert(`Failed to add product: ${error.response.data.message || 'An error occurred.'}`);
        } else {
          alert('Failed to add product. Make sure the image is selected.');
        }
      }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
        }}
      >
        <Typography variant="h5" sx={{fontSize: '30px', fontWeight: '800', color: '#89343b'}}>Add New Product</Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField 
            margin="normal" 
            required 
            fullWidth 
            label="Product Name" 
            value={productName} 
            onChange={(e) => setProductName(e.target.value)} 
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#5A5A5A' },
                '&:hover fieldset': { borderColor: 'black' },
                '&.Mui-focused fieldset': { borderColor: '#89343b' },
              },
            }}
          />
          <TextField 
            margin="normal" 
            required 
            fullWidth 
            label="Description" 
            multiline 
            rows={4} 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#5A5A5A' },
                '&:hover fieldset': { borderColor: 'black' },
                '&.Mui-focused fieldset': { borderColor: '#89343b' },
              },
            }}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Category</InputLabel>
            <Select value={category} onChange={(e) => setCategory(e.target.value)} required>
              <MenuItem value="Food">Food</MenuItem>
              <MenuItem value="Clothes">Clothes</MenuItem>
              <MenuItem value="Accessories">Accessories</MenuItem>
              <MenuItem value="Stationery or Arts and Crafts">Stationery / Arts and Crafts</MenuItem>
              <MenuItem value="Merchandise">Merchandise</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select value={status} onChange={(e) => setStatus(e.target.value)} required>
              <MenuItem value="Available">Available</MenuItem>
              <MenuItem value="Sold">Sold</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Condition</InputLabel>
            <Select value={conditionType} onChange={(e) => setConditionType(e.target.value)} required>
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
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#5A5A5A' },
                '&:hover fieldset': { borderColor: 'black' },
                '&.Mui-focused fieldset': { borderColor: '#89343b' },
              },
            }}
          />
          <TextField 
            margin="normal" 
            required 
            fullWidth 
            type="number" 
            label="Price" 
            value={price} 
            onChange={(e) => setPrice(e.target.value)} 
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#5A5A5A' },
                '&:hover fieldset': { borderColor: 'black' },
                '&.Mui-focused fieldset': { borderColor: '#89343b' },
              },
            }}
          />
          <div>
            <label>Image:</label>
            <input 
              type="file" 
              onChange={(e) => {
                const file = e.target.files[0];
                setImageFile(file);
                console.log("Selected file:", file); // Debugging line
              }} 
              required 
            />
          </div>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            sx={{ marginTop: 3, width: '100%', bgcolor: '#89343b' }}
          >
            Add Product
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default AddProductForm;
