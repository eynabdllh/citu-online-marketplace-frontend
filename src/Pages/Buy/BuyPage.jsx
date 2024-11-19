import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography, Card, CardContent, CardMedia, Avatar, FormControl, InputLabel, Select, MenuItem, InputBase, IconButton, Menu, Button } from '@mui/material';
import { Search as SearchIcon, FilterList as FilterListIcon } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/system';
 
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
  paddingLeft: `calc(1em + ${theme.spacing(4)})`,
  paddingRight: theme.spacing(2),
  width: '100%',
}));
 
const FilterButton = styled(IconButton)({
  marginLeft: '10px',
});
 
const BuyPage = () => {
  const navigate = useNavigate();
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
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
    const searchValue = event.target.value;
    setSearchTerm(searchValue);
 
    if (searchValue === '') {
      setFilters({
        category: '',
        status: '',
        conditionType: '',
      });
      setFilteredProducts(allProducts);
    }
  };
 
  const handleClearFilters = () => {
    setFilters({
      category: '',
      status: '',
      conditionType: '',
    });
    setFilteredProducts(allProducts);
  };
 
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/product/getAllProducts/${loggedInUser}`);
        console.log("All products fetched:", response.data);
        setAllProducts(response.data);
        setFilteredProducts(response.data);
      } catch (error) {
        console.error("Error fetching all products:", error);
      } finally {
        setLoading(false);
      }
    };
 
    fetchAllProducts();
  }, [loggedInUser]);
 
  useEffect(() => {
    const fetchFilteredProducts = async () => {
      console.log('Fetching filtered products with filters:', filters);
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:8080/api/product/getAllProductsFilter/${loggedInUser}`,
          {
            params: {
              username: loggedInUser,
              category: filters.category,
              status: filters.status,
              conditionType: filters.conditionType,
            },
          }
        );
        console.log("Filtered products from API:", response.data);
        setFilteredProducts(response.data);
      } catch (error) {
        console.error("Error fetching filtered products:", error);
      } finally {
        setLoading(false);
      }
    };
 
    if (filters.category || filters.status || filters.conditionType) {
      fetchFilteredProducts();
    } else {
     
      setFilteredProducts([]);
    }
  }, [filters, loggedInUser]);
 
  useEffect(() => {
    console.log("Search term changed:", searchTerm);
    if (searchTerm) {
      console.log("Applying search:", searchTerm);
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      const searchedProducts = filteredProducts.filter((product) =>
        product.name.toLowerCase().includes(lowerCaseSearchTerm)
      );
      console.log('Filtered products after search:', searchedProducts);
      setFilteredProducts(searchedProducts);
    } else {
      console.log("Resetting filtered products after clearing search.");
      setFilteredProducts(filteredProducts);
    }
  }, [searchTerm, filteredProducts]);
 
  if (loading) return <div>Loading...</div>;
 
  return (
    <Box sx={{ padding: '16px' }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '32px', position: 'relative', zIndex: 1000, height: '40px' }}>
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
            anchorReference="anchorPosition"
            anchorPosition={
              filterAnchorEl
                ? { top: filterAnchorEl.getBoundingClientRect().bottom, left: filterAnchorEl.getBoundingClientRect().left }
                : undefined
            }
            open={Boolean(filterAnchorEl)}
            onClose={handleFilterClose}
            sx={{
              '& .MuiPaper-root': {
                backgroundColor: '#ffffff',
                padding: 2,
                position:'fixed'
              },
            }}
          >
            <Box sx={{ padding: 2 }}>
              <FormControl fullWidth sx={{ marginBottom: 2 }}>
                <InputLabel>Category</InputLabel>
                <Select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  label="category"
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
                  label="status"
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="Available">Available</MenuItem>
                  <MenuItem value="Sold">Sold</MenuItem>
                </Select>
              </FormControl>
 
              <FormControl fullWidth sx={{ marginBottom: 2 }}>
                <InputLabel>Condition</InputLabel>
                <Select
                  value={filters.conditionType}
                  onChange={(e) => handleFilterChange('conditionType', e.target.value)}
                  label="Condition"
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="Brand New">Brand New</MenuItem>
                  <MenuItem value="Pre-Loved">Pre-Loved</MenuItem>
                  <MenuItem value="None">None</MenuItem>
                </Select>
              </FormControl>
 
              <Button onClick={handleClearFilters} variant="outlined" color="primary" sx={{ width: '100%' }}>
                Clear Filters
              </Button>
            </Box>
          </Menu>
      </Box>
 
      <Grid container spacing={2}>
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <Grid item xs={2.4} key={product.code}>
              <Card
                onClick={() => handleCardClick(product.code)}
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
                <Box sx={{ display: 'flex', alignItems: 'center', margin: '5px', color: 'gray', padding: '10px' }}>
                  <Avatar />
                  <Box sx={{ ml: 1 }}>
                    <Typography variant="subtitle1" color="black" sx={{ lineHeight: 1, mb: 0, fontWeight: 500 }}>
                      {product.sellerUsername}
                    </Typography>
                    <Typography variant="subtitle2" color="gray" sx={{ mt: 0, fontSize: '12px' }}>
                      2 months ago
                    </Typography>
                  </Box>
                </Box>
 
                <CardMedia
                  component="img"
                  height="140"
                  image={`http://localhost:8080/${product.imagePath}`}
                  alt={product.name}
                />
                <CardContent>
                  <Typography color="black" noWrap>
                    {product.name}
                  </Typography>
                  <Typography variant="h6" noWrap sx={{ mt: 0, color: 'black' }}>
                    {product.buyPrice}
                  </Typography>
                  <Typography variant="body1">{product.pdtDescription}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="h6">No products found</Typography>
        )}
      </Grid>
    </Box>
  );
};
export default BuyPage;