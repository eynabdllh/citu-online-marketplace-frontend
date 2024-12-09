import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Container, Typography, Box, FormControl, InputLabel, MenuItem, Select} from '@mui/material';
import { useNavigate } from 'react-router-dom'; 
import '../../App.css';
import { toast } from "react-hot-toast";


const UpdateProductForm = ({ product, onUpdateSuccess, setProduct }) => {
  const [productName, setProductName] = useState(product.name || '');
  const [description, setDescription] = useState(product.pdtDescription || '');
  const [quantity, setQuantity] = useState(product.qtyInStock || '');
  const [price, setPrice] = useState(product.buyPrice || '');
  const [imageFile, setImageFile] = useState(null);
  const [category, setCategory] = useState(product.category || '');
  const [status, setStatus] = useState(product.status || '');
  const [conditionType, setConditionType] = useState(product.conditionType || '');
  const navigate = useNavigate(); 

  useEffect(() => {
    setProductName(product.name || '');
    setDescription(product.pdtDescription || '');
    setQuantity(product.qtyInStock || '');
    setPrice(product.buyPrice || '');
    setCategory(product.category || '');
    setStatus(product.status || '');
    setConditionType(product.conditionType || '');
  }, [product]);

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

    const formData = new FormData();

    const productData = {
      name: productName,
      pdtDescription: description,
      qtyInStock: quantity,
      buyPrice: price,
      category,
      status,
      conditionType: conditionType,
    };

    formData.append('product', new Blob([JSON.stringify(productData)], {
      type: 'application/json',
    }));

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

  return (
    <Container component="main" maxWidth="sm">
      <Box sx={{ marginTop: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h5" sx={{ fontSize:'30px', fontWeight: 'bold', mb: 2, color: '#89343b', justifyContent:'center', display:'flex' }}>
          Update Product
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
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
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            InputLabelProps={{ shrink: true }}
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
            InputLabelProps={{ shrink: true }}
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
                />
            </Box>
          </FormControl>
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
