import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Container, Typography, Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import '../../App.css';
import { toast } from 'react-hot-toast';

const UpdateProductForm = ({ product, onUpdateSuccess, setProduct }) => {
  const [formState, setFormState] = useState({
    name: product.name || '',
    pdtDescription: product.pdtDescription || '',
    qtyInStock: product.qtyInStock || '',
    buyPrice: product.buyPrice || '',
    category: product.category || '',
    status: product.status || '',
    conditionType: product.conditionType || '',
  });
  const [imageFile, setImageFile] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    setFormState({
      name: product.name || '',
      pdtDescription: product.pdtDescription || '',
      qtyInStock: product.qtyInStock || '',
      buyPrice: product.buyPrice || '',
      category: product.category || '',
      status: product.status || '',
      conditionType: product.conditionType || '',
    });
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, pdtDescription, qtyInStock, buyPrice, category, status, conditionType } = formState;

    // Validation
    if (!name || !pdtDescription || !qtyInStock || !buyPrice || !category || !status || !conditionType) {
      toast.error('Please fill out all required fields');
      return;
    }
    if (Number(buyPrice) <= 0) {
      toast.error('Price must be greater than 0');
      return;
    }
    if (Number(qtyInStock) <= 0) {
      toast.error('Quantity must be greater than 0');
      return;
    }

    const formData = new FormData();
    const productData = {
      name,
      pdtDescription,
      qtyInStock,
      buyPrice,
      category,
      status,
      conditionType,
    };

    formData.append(
      'product',
      new Blob([JSON.stringify(productData)], {
        type: 'application/json',
      })
    );

    if (imageFile) {
      formData.append('imagePath', imageFile);
    }

    try {
      await axios.put(`http://localhost:8080/api/product/putProductDetails/${product.code}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Product updated successfully!');
      onUpdateSuccess();
      const response = await axios.get(`/api/product/getProductByCode/${product.code}`);
      setProduct(response.data);
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error(error.response?.data?.message || 'Failed to update product');
    }
  };

  const { name, pdtDescription, qtyInStock, buyPrice, category, status, conditionType } = formState;

  return (
    <Container component="main" maxWidth="sm">
      <Box sx={{ marginTop: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography
          variant="h5"
          sx={{ fontSize: '30px', fontWeight: 'bold', mb: 2, color: '#89343b', textAlign: 'center' }}
        >
          Update Product
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            name="name"
            label="Product Name"
            fullWidth
            required
            margin="normal"
            value={name}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            name="pdtDescription"
            label="Description"
            fullWidth
            required
            multiline
            rows={4}
            margin="normal"
            value={pdtDescription}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Category</InputLabel>
            <Select name="category" value={category} onChange={handleChange} required>
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
            <Select name="status" value={status} onChange={handleChange} required>
              <MenuItem value="Available">Available</MenuItem>
              <MenuItem value="Sold">Sold</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Condition</InputLabel>
            <Select name="conditionType" value={conditionType} onChange={handleChange} required>
              <MenuItem value="Brand New">Brand New</MenuItem>
              <MenuItem value="Pre-Loved">Pre-Loved</MenuItem>
              <MenuItem value="None">None</MenuItem>
            </Select>
          </FormControl>
          <TextField
            name="qtyInStock"
            label="Quantity in Stock"
            type="number"
            fullWidth
            required
            margin="normal"
            value={qtyInStock}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            name="buyPrice"
            label="Price"
            type="number"
            fullWidth
            required
            margin="normal"
            value={buyPrice}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
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
                cursor: 'pointer',
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
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </Box>
          </FormControl>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 3, width: '100%', bgcolor: '#89343b' }}
          >
            Update Product
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default UpdateProductForm;
