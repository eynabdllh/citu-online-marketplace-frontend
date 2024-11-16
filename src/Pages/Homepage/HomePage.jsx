import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardMedia, TextField, InputAdornment, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/product/getAllProducts');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCardClick = (code) => {
    navigate(`/product/${code}`);
  };

  return (
    <>
      <Box 
        sx={{ 
          width: "auto",
          position: 'relative',
          padding: { xs: '16px', sm: '240px', md: '120px' },
          borderRadius: '8px', 
          mt: 4,
          mx: '4%',
          backgroundImage: `url('/images/homepage.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          '&:before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)', 
            zIndex: 1,
            borderRadius: '8px'
          },
          zIndex: 2, 
        }}
      >
        <Typography variant="h2" align="center" sx={{ fontWeight: 'bold', mt: 2, zIndex: 2, marginBottom: 3, color: 'white'}}>
          Welcome Wildcats!
        </Typography>

        {/* Search Bar */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, zIndex: 2 }}>
          <TextField
            variant="outlined"
            placeholder="What are you looking for?"
            value={searchQuery}
            onChange={handleSearchChange}
            sx={{ width: '700px', bgcolor: 'white', borderRadius: '4px', border: '2px solid #ffd700' }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Category Buttons*/}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2, flexWrap: 'wrap', zIndex: 2 }}>
          {['Apparel', 'Supplies', 'Electronics', 'Materials', 'Beauty', 'Courses'].map((category) => (
            <Button variant="outlined" key={category} sx={{ fontWeight: 'bold', border: '2px solid #ffd700', color: '#ffd700' }}>
              {category}
            </Button>
          ))}
        </Box>
        
      </Box>
      
      {/* Recently Listed Products */}
      <Box sx={{ mt: 4, marginBottom: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, marginLeft: 10, marginBottom: 5 }}>
          Listed Recently
        </Typography>
        <Grid container spacing={2} marginLeft={9}>
          {products.map((product) => (
            <Grid item xs={6} sm={4} md={2.4} key={product.id}> 
              <Card onClick={() => handleCardClick(product.code)} sx={{ cursor: 'pointer', borderRadius: '8px' }}>
                <CardMedia
                  component="img"
                  height="300"
                  image={`http://localhost:8080/${product.imagePath}`}
                  alt={product.name}
                  sx={{ borderRadius: '8px', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/200';
                  }}
                />
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
}

export default HomePage;