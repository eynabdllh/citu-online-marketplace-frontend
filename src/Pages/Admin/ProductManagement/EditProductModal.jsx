import React, { useState, useEffect } from 'react';
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
  MenuItem
} from '@mui/material';
import { styled } from '@mui/material/styles';

const EditProductModal = ({ open, onClose, product, onSave }) => {
  const [editData, setEditData] = useState({
    code: '',
    name: '',
    pdtDescription: '',
    qtyInStock: '',
    buyPrice: '',
    category: '',
    imagePath: '',
    availability: 'Available'
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

  useEffect(() => {
    if (product) {
      setEditData(product.product);
      setSelectedFile(null);
    }
  }, [product]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!editData.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!editData.pdtDescription.trim()) {
      newErrors.pdtDescription = 'Description is required';
    }

    if (!editData.qtyInStock) {
      newErrors.qtyInStock = 'Stock quantity is required';
    } else if (Number(editData.qtyInStock) < 0) {
      newErrors.qtyInStock = 'Stock quantity cannot be negative';
    }

    if (!editData.buyPrice) {
      newErrors.buyPrice = 'Price is required';
    } else if (Number(editData.buyPrice) <= 0) {
      newErrors.buyPrice = 'Price must be greater than 0';
    }

    if (!editData.category) {
      newErrors.category = 'Category is required';
    }

    if (!editData.availability) {
      newErrors.availability = 'Availability status is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave({
        ...product,
        product: {
          ...editData,
          qtyInStock: Number(editData.qtyInStock),
          buyPrice: Number(editData.buyPrice)
        }
      });
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Product</DialogTitle>
      <DialogContent>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Product Code"
              value={editData.code || ''}
              disabled
              sx={{ bgcolor: 'action.hover' }}
            />
          </Grid>
          
          <Grid item xs={6}>
            <TextField
              required
              fullWidth
              label="Product Name"
              value={editData.name || ''}
              onChange={(e) => setEditData({...editData, name: e.target.value})}
              error={!!errors.name}
              helperText={errors.name}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={editData.pdtDescription || ''}
              onChange={(e) => setEditData({...editData, pdtDescription: e.target.value})}
              error={!!errors.pdtDescription}
              helperText={errors.pdtDescription}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              type="number"
              label="Stock Quantity"
              value={editData.qtyInStock || ''}
              onChange={(e) => setEditData({...editData, qtyInStock: e.target.value})}
              error={!!errors.qtyInStock}
              helperText={errors.qtyInStock}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              type="number"
              label="Price"
              value={editData.buyPrice || ''}
              onChange={(e) => setEditData({...editData, buyPrice: e.target.value})}
              error={!!errors.buyPrice}
              helperText={errors.buyPrice}
            />
          </Grid>

          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={editData.category || ''}
                label="Category"
                onChange={(e) => setEditData({...editData, category: e.target.value})}
              >
                <MenuItem value="Electronics">Electronics</MenuItem>
                <MenuItem value="Accessories">Accessories</MenuItem>
                <MenuItem value="Clothing">Clothing</MenuItem>
                <MenuItem value="Books">Books</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <FormControl fullWidth error={!!errors.availability}>
              <InputLabel>Status</InputLabel>
              <Select
                value={editData.availability || ''}
                label="Availability"
                onChange={(e) => setEditData({...editData, availability: e.target.value})}
              >
                <MenuItem value="Available">Available</MenuItem>
                <MenuItem value="Sold Out">Sold Out</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <Button
              component="label"
              variant="outlined"
              fullWidth
              sx={{ height: '56px' }}
            >
              {selectedFile ? selectedFile.name : 'Choose Product Image'}
              <VisuallyHiddenInput
                type="file"
                accept="image/*"
                onChange={(e) => {
                  setSelectedFile(e.target.files[0]);
                  setEditData({
                    ...editData,
                    imagePath: URL.createObjectURL(e.target.files[0])
                  });
                }}
              />
            </Button>
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
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProductModal;
