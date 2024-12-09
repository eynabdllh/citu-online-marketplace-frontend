import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box} from '@mui/material';

const ProductViewModal = ({ open, onClose, product }) => {
  if (!product) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Product Details</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
          <Box>
            <img
              src={`http://localhost:8080/${product.imagePath}`}
              alt={product.name}
              style={{ width: 350, height: 350, objectFit: 'cover' }}
            />
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, flex: 1 }}>
            <Typography variant="h6">{product.name}</Typography>
            <Typography variant="body1">{product.pdtDescription}</Typography>
            <Typography variant="body2">Stock: {product.qtyInStock}</Typography>
            <Typography variant="body2">Price: ₱{product.buyPrice}</Typography>
            <Typography variant="body2">Category: {product.category}</Typography>
            <Typography variant="body2">Seller: {product.sellerUsername || product.seller?.username || 'N/A'}</Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined" color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductViewModal;
