import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom'; 
//import '../../App.css';
import '../App.css';

const BoldTextField = styled(TextField)({
  '& .MuiInputBase-input': {
    fontWeight: 'bold', 
  },
});

const UpdateProductForm = ({ product, onUpdateSuccess }) => {
  const [productName, setProductName] = useState(product.name || '');
  const [description, setDescription] = useState(product.pdtDescription || '');
  const [quantity, setQuantity] = useState(product.qtyInStock || '');
  const [price, setPrice] = useState(product.buyPrice || '');
  const [imageFile, setImageFile] = useState(null); 
  const navigate = useNavigate(); 

  useEffect(() => {
    setProductName(product.name || '');
    setDescription(product.pdtDescription || '');
    setQuantity(product.qtyInStock || '');
    setPrice(product.buyPrice || '');
  }, [product]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    const productData = {
      name: productName,
      pdtDescription: description,
      qtyInStock: quantity,
      buyPrice: price,
    };

    formData.append('product', new Blob([JSON.stringify(productData)], {
      type: 'application/json',
    }));

    if (imageFile) {
      formData.append('imagePath', imageFile);
    }

    try {
      const response = await axios.put(`http://localhost:8080/api/product/putProductDetails/${product.code}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      alert(response.data.message || 'Product updated successfully!');
      onUpdateSuccess(); 
      navigate(`/`); 
    } catch (error) {
      console.error('Error updating product:', error);
      if (error.response) {
        alert(`Failed to update product: ${error.response.data.message || 'An error occurred.'}`);
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
        <Typography variant="h5" sx={{fontSize:'30px', fontWeight:'800', color:'#89343b'}}> Update Product</Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <BoldTextField
            margin="normal"
            required
            fullWidth
            label="Product Name"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
          <BoldTextField
            margin="normal"
            required
            fullWidth
            label="Description"
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <BoldTextField
            margin="normal"
            required
            fullWidth
            type="number"
            label="Quantity in Stock"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
          <BoldTextField
            margin="normal"
            required
            fullWidth
            type="number"
            label="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <div style={{ marginTop: '10px' }}>
            <label>Image (optional):</label>
            <input
              type="file"
              onChange={(e) => setImageFile(e.target.files[0])}
            />
          </div>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ marginTop: 3, width: '100%', bgcolor: '#89343b' }}
          >
            Update Product
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default UpdateProductForm;
