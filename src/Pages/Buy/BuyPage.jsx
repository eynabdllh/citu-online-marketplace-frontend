import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled, alpha } from '@mui/material/styles';
import { Avatar, Box, Typography, Card, CardContent, Grid, CardMedia, IconButton, Menu, FormControl, Select, InputLabel, MenuItem } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import InputBase from '@mui/material/InputBase';
import axios from 'axios';
import '../../App.css';

const BuyPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    conditionType: '',
  });

  const loggedInUser = sessionStorage.getItem('username');
  console.log("Logged-in username:", loggedInUser);

  const handleCardClick = (code) => {
    navigate(`product/${code}`);
  };

  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleFilterChange = (key, value) => {
    setFilters((prevFilters) => ({ ...prevFilters, [key]: value }));
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

  const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: `${theme.shape.borderRadius}px 0 0 ${theme.shape.borderRadius}px`, 
    backgroundColor: alpha(theme.palette.common.white, 0.80),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 1),
    },
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

  const FilterButton = styled(IconButton)(({ theme }) => ({
    backgroundColor: alpha(theme.palette.common.white, 0.8),
    borderRadius: `0 ${theme.shape.borderRadius}px ${theme.shape.borderRadius}px 0`,
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 1),
    },
  }));

  if (loading) return <div>Loading...</div>;

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
          height: '40px', 
        }}
      >
        <Search sx={{ height: '100%', }}>
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

        <FilterButton onClick={handleFilterClick}
        sx={{ height: '100%', }}>
          <FilterListIcon />
        </FilterButton>
        <Menu
          anchorEl={filterAnchorEl}
          open={Boolean(filterAnchorEl)}
          onClose={handleFilterClose}
          sx={{
            '& .MuiPaper-root': {
              backgroundColor: alpha('#ffffff', 0.95),
              padding: 2,
            },
          }}
        >
          <Box sx={{ padding: 2 }}>
            <FormControl fullWidth sx={{ marginBottom: 2 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                label="Category"
              >
                <MenuItem value="">All</MenuItem>
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
            
            <FormControl fullWidth sx={{ marginBottom: 2 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                label="Status"
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Available">Available</MenuItem>
                <MenuItem value="Sold">Sold</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Condition</InputLabel>
              <Select
                value={filters.conditionType}
                onChange={(e) => handleFilterChange('conditionType', e.target.value)}
                label="ConditionType"
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Brand New">Brand New</MenuItem>
                <MenuItem value="Pre-Loved">Pre-Loved</MenuItem>
                <MenuItem value="None">None</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Menu>
      </Box>
      
    <Grid container spacing={2}>
    {Array.isArray(products) && products.length > 0 ? (
          products.map((product) => (
            <Grid item xs={2.4} key={ product.code }>
              <Card onClick={() => handleCardClick(product.code)}
              sx={{
                width: '100%',
                marginLeft: '30px',
                marginTop: '20px',
                backgroundColor: 'transparent', 
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
  );
};

export default BuyPage;