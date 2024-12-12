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
  Snackbar
} from '@mui/material';
import ToastManager from '../../../components/ToastManager';

const UpdateProductModal = ({ open, onClose, product }) => {
  const [editData, setEditData] = useState({
    name: '',
    pdtDescription: '',
    qtyInStock: '',
    buyPrice: '',
    category: '',
    status: ''
  });
  const [errors, setErrors] = useState({});
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    if (product) {
      setEditData({
        name: product.name || '',
        pdtDescription: product.pdtDescription || '',
        qtyInStock: product.qtyInStock || '',
        buyPrice: product.buyPrice || '',
        category: product.category || '',
        status: product.status || 'Available'
      });
    }
  }, [product]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!editData.name.trim()) newErrors.name = 'Product name is required';
    if (!editData.pdtDescription.trim()) newErrors.pdtDescription = 'Description is required';
    if (!editData.qtyInStock) newErrors.qtyInStock = 'Stock quantity is required';
    if (Number(editData.qtyInStock) < 0) newErrors.qtyInStock = 'Stock quantity cannot be negative';
    if (!editData.buyPrice) newErrors.buyPrice = 'Price is required';
    if (Number(editData.buyPrice) <= 0) newErrors.buyPrice = 'Price must be greater than 0';
    if (!editData.category) newErrors.category = 'Category is required';
    if (!editData.status) newErrors.status = 'Status is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        const response = await axios.put(
          `http://localhost:8080/api/admin/editproducts/${product.code}`,
          {
            ...editData,
            qtyInStock: Number(editData.qtyInStock),
            buyPrice: Number(editData.buyPrice)
          }
        );

        if (response.status === 200) {
          showToast('Product updated successfully', 'success');
          onClose();
        }
      } catch (error) {
        showToast(error.response?.data?.message || 'Error updating product', 'error');
      }
    }
  };

  const showToast = (message, severity = 'success') => {
    const newToast = {
      id: Date.now(),
      message,
      severity,
      open: true
    };
    setToasts(current => [newToast, ...current].slice(0, 2));
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>Update Product</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Product Name"
                value={editData.name}
                onChange={(e) => setEditData({...editData, name: e.target.value})}
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
                value={editData.pdtDescription}
                onChange={(e) => setEditData({...editData, pdtDescription: e.target.value})}
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
                value={editData.qtyInStock}
                onChange={(e) => setEditData({...editData, qtyInStock: e.target.value})}
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
                value={editData.buyPrice}
                onChange={(e) => setEditData({...editData, buyPrice: e.target.value})}
                error={!!errors.buyPrice}
                helperText={errors.buyPrice}
              />
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth required error={!!errors.category}>
                <InputLabel>Category</InputLabel>
                <Select
                  value={editData.category}
                  label="Category"
                  onChange={(e) => setEditData({...editData, category: e.target.value})}
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
                  value={editData.status}
                  label="Status"
                  onChange={(e) => setEditData({...editData, status: e.target.value})}
                >
                  <MenuItem value="Available">Available</MenuItem>
                  <MenuItem value="Sold Out">Sold Out</MenuItem>
                </Select>
              </FormControl>
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

      <ToastManager toasts={toasts} handleClose={(id) => {
        setToasts(current => 
          current.map(toast => 
            toast.id === id ? { ...toast, open: false } : toast
          )
        );
      }} />
    </>
  );
};

export default UpdateProductModal;
