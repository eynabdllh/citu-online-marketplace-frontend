import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Box, MenuItem, Select, FormControl, InputLabel, Modal } from '@mui/material';
import { useNavigate } from 'react-router-dom'; 
import '../../App.css';

const AddProductForm = ({ open, handleClose }) => { 
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [conditionType, setConditionType] = useState('');
  const [sellerUsername, setSellerUsername] = useState('');
  const [sellerInfo, setSellerInfo] = useState(null); 
  const navigate = useNavigate();

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!productName || !description || !quantity || !price || !category || !status || !conditionType || !imageFile) {
      alert('All fields must be filled in');
      return;
    }

    if (isNaN(price) || isNaN(quantity)) {
      alert('Price and Quantity must be valid numbers');
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
      alert('No image selected.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/api/product/postproduct', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',  
        }
      });
      alert(response.data.message || 'Product added successfully!');

      // Clear the fields
      setProductName('');
      setDescription('');
      setQuantity('');
      setPrice('');
      setImageFile(null);
      setCategory('');
      setStatus('');
      setConditionType('');

      handleClose(); 
      navigate('/home');  
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product. Please check the console for details.');
    }
  };

  return (
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
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Category</InputLabel>
            <Select value={category} onChange={(e) => setCategory(e.target.value)} required>
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
          <TextField
            margin="normal"
            fullWidth
            label="Seller Username"
            value={sellerUsername}
            readOnly
          />
          <div>
            <label>Image:</label>
            <input type="file" onChange={(e) => setImageFile(e.target.files[0])} required />
          </div>
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
  );
};

export default AddProductForm;