import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Paper,
  Grid,
  Divider
} from '@mui/material';

const ViewProductAdmin = ({ open, onClose, product }) => {
  if (!product) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ 
        bgcolor: '#89343b',
        color: 'white',
        fontWeight: 'bold'
      }}>
        Product Details
      </DialogTitle>
      <DialogContent>
        <Box sx={{ p: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={5}>
              <img
                src={`http://localhost:8080/${product.imagePath}`}
                alt={product.name}
                style={{ 
                  width: 330,
                  height: 400,
                  maxHeight: 400,
                  objectFit: 'cover',
                  borderRadius: 8,
                  border: '1px solid #ddd'
                }}
              />
            </Grid>
            <Grid item xs={12} md={7}>
              <Typography variant="h4" sx={{ color: '#89343b', mb: 2, fontWeight: 'bold' }}>
                {product.name}
              </Typography>
              <Typography variant="h5" sx={{ color: '#89343b', fontWeight: 'bold', mt: 0 }}>
                  ₱{product.buyPrice.toLocaleString()}
                </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ color: '#666', mb: 1 }}>
                  <strong>Product Code:</strong> {product.code}
                </Typography>
                <Typography variant="subtitle1" sx={{ color: '#666', mb: 1 }}>
                  <strong>Category:</strong> {product.category}
                </Typography>
                <Typography variant="subtitle1" sx={{ color: '#666', mb: 1 }}>
                  <strong>Status:</strong> {product.status}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ color: '#89343b', mb: 1 }}>
                  Stock Information
                </Typography>
                <Typography variant="subtitle1" sx={{ color: '#666', mb: 1 }}>
                  <strong>Available Stock:</strong> {product.qtyInStock} units
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box>
                <Typography variant="h6" sx={{ color: '#89343b', mb: 1 }}>
                  Description
                </Typography>
                <Typography variant="body1" sx={{ color: '#666', lineHeight: 1.6 }}>
                  {product.pdtDescription}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, bgcolor: '#f5f5f5' }}>
        <Button 
          onClick={onClose} 
          variant="contained"
          sx={{
            bgcolor: '#89343b',
            '&:hover': { bgcolor: '#6d2931' }
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewProductAdmin;