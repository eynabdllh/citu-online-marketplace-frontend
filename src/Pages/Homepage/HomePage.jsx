import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Avatar, CardContent, Card, CardMedia, TextField, InputAdornment, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loggedInUser = sessionStorage.getItem('username');
  console.log("Logged-in username:", loggedInUser);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCardClick = (code) => {
    navigate(`/product/${code}`);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/product/getAllProducts/${loggedInUser}`
        );
        console.log("API Response: ", response.data);
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [loggedInUser]);

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
        <Grid container spacing={2}>
          {Array.isArray(products) && products.length > 0 ? (
                products.map((product) => (
                  <Grid item xs={2.4} key={ product.code }>
                    <Card onClick={() => handleCardClick(product.code)}
                    sx={{
                      width: '100%',
                      marginLeft: '55px',
                      marginTop: '0px',
                      backgroundColor: 'white', 
                      boxShadow: 'none', 
                      transition: '0.3s', 
                      '&:hover': {
                        boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', margin: '5px', color: 'gray', padding: '10px'}}>
                      <Avatar />
                      <Box sx={{ ml: 1}}> 
                        <Typography variant="subtitle1" color="black" sx={{ lineHeight: 1, mb: 0, fontWeight: 500 }}>{product.sellerUsername}</Typography>
                        <Typography variant="subtitle2" color="gray" sx={{ mt: 0, fontSize: "12px"}}>2 months ago</Typography>
                      </Box>
                    </Box>

                    <CardMedia
                      component="img"
                      height="140"
                      image={`http://localhost:8080/${product.imagePath}`}
                      alt={product.name}
                    />
                    <CardContent>
                      <Typography color="black" noWrap>{product.name}</Typography>
                        <Typography variant="h6" noWrap sx={{ mt: 0, fontWeight: "bold"}}>PHP {product.buyPrice}</Typography>
                        <Typography variant="body1">{product.pdtDescription}</Typography>
                      </CardContent>
                  </Card>
                </Grid>
                ))
              ) : (
                <Typography variant="h6" sx={{ textAlign: 'center', marginTop: 4 }}>
                  No products to display.
                </Typography>
              )}
          </Grid>
      </Box>
    </>
  );
}

export default HomePage;