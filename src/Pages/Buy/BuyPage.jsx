import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography, Card, CardContent, CardMedia, Avatar, FormControl, InputLabel, Select, MenuItem, InputBase, IconButton, Menu, Button } from '@mui/material';
import { Search as SearchIcon, FilterList as FilterListIcon } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/system';

// Styled components
const Search = styled('div')({
  position: 'relative',
  borderRadius: '4px',
  backgroundColor: '#f1f1f1',
  '&:hover': {
    backgroundColor: '#e0e0e0',
  },
  marginLeft: 0,
  width: '20%',
  alignContent: 'center',
});

const SearchIconWrapper = styled('div')({
  position: 'absolute',
  left: '10px',
  top: '50%',
  transform: 'translateY(-50%)',
});

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  paddingLeft: `calc(1em + ${theme.spacing(4)})`, // to make space for the icon
  paddingRight: theme.spacing(2),
  width: '100%',
}));

const FilterButton = styled(IconButton)({
  marginLeft: '10px',
});

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

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleClearFilters = () => {
    setFilters({
      category: '',
      status: '',
      conditionType: '',
    });
    setSearchTerm('');
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

  const filteredProducts = products.filter((product) => {
    const matchesSearchTerm =
      !searchTerm || 
      (product.name?.toLowerCase().includes(searchTerm.toLowerCase())) || 
      (product.pdtDescription?.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = 
      !filters.category || 
      (product.category?.toLowerCase() === filters.category.toLowerCase());

    const matchesStatus = 
      !filters.status || 
      (product.status?.toLowerCase() === filters.status.toLowerCase());

    const matchesCondition = 
      !filters.conditionType || 
      (product.conditionType?.toLowerCase() === filters.conditionType.toLowerCase());

    return matchesSearchTerm && matchesCategory && matchesStatus && matchesCondition;
  });

  if (loading) return <div>Loading...</div>;

  return (
    <Box sx={{ padding: '16px' }}>
      {/* Filters and Search */}
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
        <Search sx={{ height: '100%' }}>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search…"
            inputProps={{ 'aria-label': 'search' }}
            value={searchTerm}
            onChange={handleSearchChange}
            autoFocus
          />
        </Search>

        <FilterButton onClick={handleFilterClick} sx={{ height: '100%' }}>
          <FilterListIcon />
        </FilterButton>
        <Menu
          anchorEl={filterAnchorEl}
          open={Boolean(filterAnchorEl)}
          onClose={handleFilterClose}
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
                <MenuItem value="Electronics">Electronics</MenuItem>
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
                label="Condition"
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Brand New">Brand New</MenuItem>
                <MenuItem value="Pre-Loved">Pre-Loved</MenuItem>
              </Select>
            </FormControl>
            
            <Button
              variant="outlined"
              onClick={handleClearFilters}
              sx={{ marginTop: 2 }}
            >
              Clear Filters
            </Button>
          </Box>
        </Menu>
      </Box>

      {/* Product Grid */}
      <Grid container spacing={2}>
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product.code}>
              <Card>
                <CardMedia
                  component="img"
                  image={product.imagePath}
                  alt={product.name}
                />
                <CardContent>
                  <Typography>{product.name}</Typography>
                  <Typography>{product.price}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography>No Products Found</Typography>
        )}
      </Grid>
    </Box>
  );
};

export default BuyPage;
