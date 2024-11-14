import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography, Card, CardContent, Grid, CardMedia } from '@mui/material';
import axios from 'axios';
import '../../App.css';

const SellPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleAddNewProduct = () => {
    navigate('/addnewproduct');
  };

  const handleCardClick = (code) => {
    navigate(`product/${code}`); 
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/product/getAllProducts');
        console.log('Fetched Products:', response.data);
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <Box sx={{ padding: '16px'}}>
        <Box sx={{ position: 'absolute', right: '20px', zIndex: 1000    }}>
        <Button
        variant="contained"
        color="primary"
        onClick={handleAddNewProduct}
        sx={{backgroundColor: '#89343b', color: 'white',
              '&:hover': {
                backgroundColor: '#ffd700',
                color:'#89343b'
            },
        }}
      >
        + Add New Product
      </Button>
        </Box>
      {loading ? (
        <Typography variant="h6" sx={{ marginTop: '16px' }}>
          Loading products...
        </Typography>
      ) : products.length === 0 ? (
        <Typography variant="h6" sx={{ marginTop: '16px' }}>
          No products available.
        </Typography>
      ) : (
        
        <Grid container spacing={2} sx={{ marginTop: '40px' }}>
          {products.map((product) => {
            return (
              <Grid item xs={2.4} key={product.id}>
                <Card sx={{ width: '100%' }} onClick={() => handleCardClick(product.code)}> 
                  <CardMedia
                    component="img"
                    alt={product.name}
                    height="140"
                    image={`http://localhost:8080/${product.imagePath}`}
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/140'; }}
                  />
                  <CardContent>
                    <Typography variant="h6" noWrap>{product.name}</Typography>
                    <Typography color="textSecondary" noWrap>{product.pdtDescription}</Typography>
                    <Typography variant="body1">Quantity: {product.qtyInStock}</Typography>
                    <Typography variant="body1">Price: ₱{product.buyPrice.toFixed(2)}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
};

export default SellPage;