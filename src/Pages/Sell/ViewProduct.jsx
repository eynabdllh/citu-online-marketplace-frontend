import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; 
import { Box, Typography, Card, CardMedia, CardContent, Button, Grid, Avatar, IconButton } from '@mui/material';
import axios from 'axios';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import MessageIcon from '@mui/icons-material/Message';
import StarIcon from '@mui/icons-material/Star';
import '../../App.css';

const ViewProduct = () => {
  const { code } = useParams(); 
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [sellerUsername, setSellerUsername] = useState('');
  const navigate = useNavigate(); 

  useEffect(() => {
    const username = sessionStorage.getItem('username');
    if (username) {
      setSellerUsername(username);
    } else {
      alert('Please log in to view product details');
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/product/getProductByCode/${code}`);
        setProduct(response.data);
        setLoading(false);

        // Fetch seller username
        const sellerResponse = await axios.get(`http://localhost:8080/api/product/getSellerByProductCode/${code}`);
        if (sellerResponse.status === 200) {
          setSellerUsername(sellerResponse.data.sellerUsername);
        }
      } catch (error) {
        console.error('Error fetching product or seller details:', error);
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [code]);

  useEffect(() => {
    const likedProducts = JSON.parse(localStorage.getItem('likedProducts')) || [];
    if (likedProducts.includes(product?.code)) {
      setLiked(true);
    }
  }, [product?.code]);

  const handleChatRedirect = () => {
    navigate(`/message`); //navigate(`/message/${sellerUsername}`);
  };

  const handleLikeToggle = () => {
    const likedProducts = JSON.parse(localStorage.getItem('likedProducts')) || [];
  
    if (liked) {
      const updatedLikes = likedProducts.filter((id) => id !== product.code);
      localStorage.setItem('likedProducts', JSON.stringify(updatedLikes));
    } else {
      likedProducts.push(product.code);
      localStorage.setItem('likedProducts', JSON.stringify(likedProducts));
    }

    window.dispatchEvent(new Event('likesUpdated'));
    setLiked(!liked);
  };

  if (loading) {
    return <Typography variant="h6">Loading product details...</Typography>;
  }

  if (!product) {
    return <Typography variant="h6">Product not found.</Typography>;
  }

  return (
    <Box sx={{ padding: '20px', justifyContent: 'center', display: 'flex', flexDirection: 'column' }}>
      <Card sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', md: 'row' }, 
        borderRadius: '8px', 
        boxShadow: 3, 
        width: { xs: '90%', md: '80%' },
        minHeight: { xs: 'auto', md: '75vh' },
        margin: '0 auto',
        overflow: 'hidden'
      }}>
        {/* Product Image */}
        <Grid item xs={12} md={6} sx={{ 
          position: 'relative',
          minHeight: { xs: '300px', sm: '400px', md: '600px' },
          maxHeight: { xs: '400px', md: '600px' },
          width: '60%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: '#f5f5f5'
        }}>
          <CardMedia
            component="img"
            alt={product.name}
            image={`http://localhost:8080/${product.imagePath}`} 
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </Grid>

        {/* Product Details */}
        <Grid item xs={12} md={6}>
          <CardContent sx={{ 
            padding: { xs: '24px', md: '32px' },
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            <Typography variant="h3" sx={{ 
              fontWeight: 'bold',
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
            }}>
              {product.name}
            </Typography>

            <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold', marginLeft: '7px' }}>
              PHP {product.buyPrice.toFixed(2)}
            </Typography>

            {/* Seller Username and Profile */}
            <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '8px' }}>
              <Avatar
                sx={{ width: 50, height: 50, marginRight: '12px' }}
                src={`http://localhost:8080/profile-images/${product.sellerPhoto}`}
              />
              <Box>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 'bold',
                    cursor: 'pointer',
                  }}
                  onClick={() => navigate(`/profile/${sellerUsername}`)}
                >
                  {sellerUsername}
                </Typography>

                {/* Seller Rating and Sold Count */}
                <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '4px' }}>
                  {[...Array(5)].map((_, index) => (
                    <StarIcon
                      key={index}
                      sx={{
                        color: index < product.sellerRating ? '#FFD700' : '#FFD700', 
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
            <Box sx={{ 
              display: 'flex', 
              gap: '20px', 
              mt: 'auto', 
              mb: 'auto',
              flexWrap: 'wrap',
              justifyContent: { xs: 'center', md: 'flex-start' }
            }}>
              <Button variant="contained" sx={{ bgcolor: '#89343b' }} onClick={handleChatRedirect}>
                <MessageIcon sx={{ marginRight: '8px' }} /> Chat with Seller
              </Button>
              <IconButton
                sx={{
                  color: liked ? '#89343b' : '#ccc',
                  marginTop: '8px',
                  fontSize: '36px', 
                  padding: '8px', 
                }}
                onClick={handleLikeToggle}
              >
                {liked ? <FavoriteIcon sx={{ fontSize: 'inherit' }} /> : <FavoriteBorderIcon sx={{ fontSize: 'inherit' }} />}
              </IconButton>
            </Box>
          </CardContent>
        </Grid>
      </Card>
    </Box>
  );
};

export default ViewProduct;
