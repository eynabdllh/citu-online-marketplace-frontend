import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; 
import { Box, Typography, Card, CardMedia, CardContent, Button, Grid, Avatar, Modal } from '@mui/material';
import axios from 'axios';
import StarIcon from '@mui/icons-material/Star';
import UpdateProductForm from '../Sell/UpdateProductForm'; 
import '../../App.css';

const ViewforSeller = () => {
  const { code } = useParams(); 
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); 
  const [editing, setEditing] = useState(false); 
  const [sellerUsername, setSellerUsername] = useState('');

  useEffect(() => {
    const username = sessionStorage.getItem('username');
    if (username) {
      setSellerUsername(username);
    } else {
      alert('Please log in to add a product');
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/product/getProductByCode/${code}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product details:', error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [code]);

  if (loading) {
    return <Typography variant="h6">Loading product details...</Typography>;
  }

  if (!product) {
    return <Typography variant="h6">Product not found.</Typography>;
  }

  const handleUpdate = () => {
    setEditing(true); 
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this product?');
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:8080/api/product/deleteProduct/${code}`);
        alert('Product deleted successfully');
        navigate('/home');
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete the product');
      }
    }
  };

  return (
    <Box sx={{ padding: '20px', justifyContent: 'center', display: 'flex', flexDirection: 'column' }}>
      <Card sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, borderRadius: '8px', boxShadow: 3, width: '90%', height: '75vh', margin: '0 auto' }}>
        {/* Product Image */}
        <Grid item xs={12} md={6}>
          <CardMedia
            component="img"
            alt={product.name}
            image={`http://localhost:8080/${product.imagePath}`} 
            sx={{
              width: '700px',
              height: '75vh', 
              objectFit: 'cover',
              borderRadius: '8px 0px 0px 8px',
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
            }}
          />
        </Grid>

        {/* Product Details */}
        <Grid item xs={12} md={6}>
          <CardContent sx={{ padding: '16px', marginLeft: '70px', marginTop: '30px' }}>
            <Typography variant="h3" sx={{ fontWeight: 'bold' }}>{product.name}</Typography>
            <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold', marginLeft: '7px' }}>
              PHP {product.buyPrice.toFixed(2)}
            </Typography>

            {/* Seller Username and Profile */}
            <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '8px' }}>
              <Avatar
                sx={{ width: 50, height: 50, marginRight: '12px' }}
                src={`http://localhost:8080/${product.sellerProfileImage}`}
              />
              <Box>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 'bold',
                  }}
                >
                 {sellerUsername}
                </Typography>

                {/* Seller Rating and Sold Count */}
                <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '4px' }}>
                  {[...Array(5)].map((_, index) => (
                    <StarIcon
                      key={index}
                      sx={{
                        color: index < product.sellerRating ? '#FFD700' : '#FFD700', //color: index < product.sellerRating ? '#FFD700' : '#ccc',
                        fontSize: '16px',
                      }}
                    />
                  ))}
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ marginLeft: '8px', fontSize: '14px' }}
                  >
                    5.0 | 10K+ Sold {/*{product.sellerRating} | {product.soldCount} Sold*/}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Product Description */}
            <Typography variant="body1" color="textSecondary" sx={{ marginTop: '36px' }}>
              {product.pdtDescription}
            </Typography>

            {/* Condition & Status */}
            <Box sx={{ marginTop: '36px' }}>
              <Typography variant="body1" color="textSecondary">
                <strong>Status:</strong> {product.status}
              </Typography>
              <Typography variant="body1" color="textSecondary">
                <strong>Condition:</strong> {product.conditionType}
              </Typography>
            </Box>

            {/* Buttons */}
            <Box sx={{ display: 'flex', gap: '20px', marginTop: '20%', marginBottom: '36px', flexWrap: 'wrap' }}>
              <Button variant="contained" sx={{ bgcolor: '#89343b' }} onClick={handleUpdate}>
                Update
              </Button>
              <Button variant="outlined" color="error" onClick={handleDelete}>
                Delete
              </Button>
            </Box>
          </CardContent>
        </Grid>
      </Card>

      {/* Update Product Modal */}
      <Modal open={editing} onClose={() => setEditing(false)}>
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
          <UpdateProductForm product={product} onUpdateSuccess={() => setEditing(false)} />
        </Box>
      </Modal>
    </Box>
  );
};

export default ViewforSeller;