import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; 
import { Box, Typography, Card, CardMedia, CardContent, Button, Grid } from '@mui/material';
import axios from 'axios';
import UpdateProductForm from './UpdateProductForm'; 
//import '../../App.css';
import '../App.css';

const ViewProduct = () => {
  const { code } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/product/getProductByCode/${code}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [code]);

  const handleUpdateSuccess = () => {
    setEditing(false);
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this product?');
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:8080/api/product/deleteProduct/${code}`);
        alert('Product deleted successfully');
        navigate('/'); 
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete the product');
      }
    }
  };

  if (loading) {
    return <Typography variant="h6">Loading product details...</Typography>;
  }

  if (!product) {
    return <Typography variant="h6">Sell Your Products Here!.</Typography>;
  }

  return (
    <Box sx={{ padding: '16px',  justifyContent: 'center', display: 'flex', height:'530px' }}>
      {editing ? (
        <UpdateProductForm product={product} onUpdateSuccess={handleUpdateSuccess} />
      ) : (
        <Card>
          <Grid container>
            <Grid item xs={7}>
              <CardMedia
                component="img"
                alt={product.name}
                image={`http://localhost:8080/${product.imagePath}`}
                onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/300x400'; }}
                sx={{
                  width: '300px',    
                  height: '550px',   
                  objectFit: 'cover', 
                }}
              />
            </Grid>
            <Grid item xs={5}>
              <CardContent sx={{ marginLeft: 1, padding: '10px'}}>
                <Typography variant="h5" gutterBottom >{product.name}</Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>PHP {product.buyPrice.toFixed(2)}</Typography>
                <Typography variant="body2" color="textSecondary" sx={{ marginBottom: '8px' }}>
                  5.0 ★★★★★ | 10K+ Sold
                </Typography>
                <Typography variant="h6" sx={{ marginBottom: '8px' }}>Description</Typography>
                <Typography variant="body2" color="textSecondary">
                  {product.pdtDescription}
                </Typography>
                <Box sx={{ display: 'flex', gap: '20px', marginTop: '16px' }}>
                  <Button variant="contained" sx={{ bgcolor: '#89343b' }} onClick={() => setEditing(true)}>
                    Update
                  </Button>
                  <Button variant="outlined" color="error" onClick={handleDelete}>
                    Delete
                  </Button>
                </Box>
              </CardContent>
            </Grid>
          </Grid>
        </Card>
      )}
    </Box>
  );
};

export default ViewProduct;
