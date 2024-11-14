import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled, alpha } from '@mui/material/styles';
import { Box, Typography, Card, CardContent, Grid, CardMedia } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import axios from 'axios';
import '../../App.css';

const BuyPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const handleCardClick = (code) => {
    navigate(`product/${code}`);
  };

  const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.80),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 1),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  }));

  const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }));

  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1, 1, 0),
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('md')]: {
        width: '20ch',
      },
    },
  }));

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/product/getAllProducts');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ padding: '16px' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          marginBottom: '32px',  
          position: 'relative',
          zIndex: 1000,
        }}
      >
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search…"
            inputProps={{ 'aria-label': 'search' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
          />
        </Search>
      </Box>

      {loading ? (
        <Typography variant="h6" sx={{ marginTop: '16px' }}>
          Loading products...
        </Typography>
      ) : filteredProducts.length === 0 ? (
        <Typography variant="h6" sx={{ marginTop: '16px' }}>
          No products available.
        </Typography>
      ) : (
        <Grid container spacing={2}>
          {filteredProducts.map((product) => (
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
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default BuyPage;