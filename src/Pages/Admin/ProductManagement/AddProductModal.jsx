import React, { useState } from 'react';
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
  Typography,
  FormHelperText
} from '@mui/material';
import { styled } from '@mui/material/styles';

const AddProductModal = ({ open, onClose, onAdd }) => {
  const [productData, setProductData] = useState({
    name: '',
    pdtDescription: '',
    qtyInStock: '',
    buyPrice: '',
    category: '',
    imagePath: ''
  });

  const [selectedFile, setSelectedFile] = useState(null);

  const [errors, setErrors] = useState({});

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

  const validateForm = () => {
    const newErrors = {};
    
    if (!productData.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!productData.pdtDescription.trim()) {
      newErrors.pdtDescription = 'Description is required';
    }

    if (!productData.qtyInStock) {
      newErrors.qtyInStock = 'Stock quantity is required';
    } else if (Number(productData.qtyInStock) < 0) {
      newErrors.qtyInStock = 'Stock quantity cannot be negative';
    }

    if (!productData.buyPrice) {
      newErrors.buyPrice = 'Price is required';
    } else if (Number(productData.buyPrice) <= 0) {
      newErrors.buyPrice = 'Price must be greater than 0';
    }

    if (!productData.category) {
      newErrors.category = 'Category is required';
    }

    if (!productData.imagePath) {
      newErrors.imagePath = 'Product image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onAdd({
        product: {
          ...productData,
          qtyInStock: Number(productData.qtyInStock),
          buyPrice: Number(productData.buyPrice)
        },
        sellerUsername: 'currentUser'
      });
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Add New Product</DialogTitle>
      <DialogContent>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Product Name"
              value={productData.name}
              onChange={(e) => setProductData({...productData, name: e.target.value})}
              error={!!errors.name}
              helperText={errors.name}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              multiline
              rows={3}
              label="Description"
              value={productData.pdtDescription}
              onChange={(e) => setProductData({...productData, pdtDescription: e.target.value})}
              error={!!errors.pdtDescription}
              helperText={errors.pdtDescription}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              required
              fullWidth
              type="number"
              label="Stock Quantity"
              value={productData.qtyInStock}
              onChange={(e) => setProductData({...productData, qtyInStock: e.target.value})}
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
              value={productData.buyPrice}
              onChange={(e) => setProductData({...productData, buyPrice: e.target.value})}
              error={!!errors.buyPrice}
              helperText={errors.buyPrice}
            />
          </Grid>

          <Grid item xs={6}>
            <FormControl fullWidth required error={!!errors.category}>
              <InputLabel>Category</InputLabel>
              <Select
                value={productData.category}
                label="Category"
                onChange={(e) => setProductData({...productData, category: e.target.value})}
              >
                <MenuItem value="Electronics">Electronics</MenuItem>
                <MenuItem value="Accessories">Accessories</MenuItem>
                <MenuItem value="Clothing">Clothing</MenuItem>
                <MenuItem value="Books">Books</MenuItem>
              </Select>
              {errors.category && (
                <FormHelperText>{errors.category}</FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <Button
              component="label"
              variant="outlined"
              fullWidth
              sx={{ height: '56px' }}
              error={!!errors.imagePath}
            >
              {selectedFile ? selectedFile.name : 'Choose Product Image'}
              <VisuallyHiddenInput
                type="file"
                accept="image/*"
                onChange={(e) => {
                  setSelectedFile(e.target.files[0]);
                  setProductData({
                    ...productData,
                    imagePath: URL.createObjectURL(e.target.files[0])
                  });
                }}
              />
            </Button>
            {errors.imagePath && (
              <FormHelperText error>{errors.imagePath}</FormHelperText>
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
  );
};

export default AddProductModal;
