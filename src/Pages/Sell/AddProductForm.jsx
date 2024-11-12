import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom'; 
import '../../App.css';

const AddProductForm = () => {
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', productName);
    formData.append('pdtDescription', description);
    formData.append('qtyInStock', quantity);
    formData.append('buyPrice', price);
  
    if (imageFile) {
      formData.append('image', imageFile);
    } else {
      alert('No image selected.');
      return;
    }
  
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }
  
    try {
        const response = await axios.post('http://localhost:8080/api/product/postproduct', formData);
        alert(response.data);
        navigate('/sell'); 
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
        maxHeight: '100vh',
      }}
    >
      <Typography variant="h5" sx={{fontSize: '30px', fontWeight: '800', color: '#89343b'}}>Add New Product</Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1}}>
        <TextField 
          margin="normal" 
          required 
          fullWidth 
          label="Product Name" 
          value={productName} 
          onChange={(e) => setProductName(e.target.value)} 
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
        />
        <TextField 
          margin="normal" 
          required 
          fullWidth 
          type="number" 
          label="Quantity in Stock" 
          value={quantity} 
          onChange={(e) => setQuantity(e.target.value)} 
        />
        <TextField 
          margin="normal" 
          required 
          fullWidth 
          type="number" 
          label="Price" 
          value={price} 
          onChange={(e) => setPrice(e.target.value)} 
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