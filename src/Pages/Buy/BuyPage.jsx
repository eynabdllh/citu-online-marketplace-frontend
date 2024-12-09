import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography, Card, CardContent, CardMedia, Avatar, FormControl, InputLabel, Select, MenuItem, InputBase, IconButton, Menu, Button } from '@mui/material';
import { Search as SearchIcon, FilterList as FilterListIcon } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
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
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search') || '';
  const categoryQuery = searchParams.get('category') || '';

  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchQuery);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [filterPosition, setFilterPosition] = useState(null); 
  const [filters, setFilters] = useState({
    category: categoryQuery,
    status: '',
    conditionType: '',
  });

  const loggedInUser = sessionStorage.getItem('username');

  const handleCardClick = (code) => {
    navigate(`product/${code}`);
  };

  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
    setFilterPosition({
      top: event.currentTarget.getBoundingClientRect().bottom,
      left: event.currentTarget.getBoundingClientRect().left,
    });
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
      setLoading(true); // Add loading indicator state
      
      try {
        const response = await axios.get(`http://localhost:8080/api/product/getAllProducts/${loggedInUser}`);
        console.log("API Response: ", response.data);  // Log the API response to see the status values

        // Filter out only approved products (check the status field value carefully)
        const approvedProducts = response.data.filter(product => product.status && product.status.toLowerCase() === 'approved');
        
        setAllProducts(approvedProducts);
        setFilteredProducts(approvedProducts);
      } catch (error) {
        console.error("Error fetching all products:", error);
      } finally {
        setLoading(false);  // Set loading to false after fetching data
      }
    };

    fetchAllProducts();
}, [loggedInUser]);


  useEffect(() => {
    const fetchFilteredProducts = async () => {
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
      setFilteredProducts(allProducts);
    }
  }, [filters, loggedInUser, allProducts]);

  useEffect(() => {
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      const searchedProducts = filteredProducts.filter((product) =>
        product.name.toLowerCase().includes(lowerCaseSearchTerm)
      );
      setFilteredProducts(searchedProducts);
    } else {
      setFilteredProducts(filteredProducts);
    }
  }, [searchTerm, filteredProducts]);

  if (loading) return <div>Loading...</div>;

  return (
    <Box sx={{ padding: '16px' }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '32px', position: 'relative', zIndex: 1000, height: '40px' }}>
        <Search sx={{ height: '100%', width: '30%' }}>
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
          anchorPosition={filterPosition}
          open={Boolean(filterAnchorEl)}
          onClose={handleFilterClose}
          sx={{
            '& .MuiPaper-root': {
              backgroundColor: '#ffffff',
              padding: 1,
              position: 'fixed',
              width: '320px', 
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

            <Button onClick={handleClearFilters} variant="outlined" color="#89343b" sx={{ width: '100%' }}>
              Clear Filters
            </Button>
          </Box>
        </Menu>
      </Box>

      <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'flex-start' }}>
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product.code}>
              <Card
                onClick={() => handleCardClick(product.code)}
                sx={{
                  width: '100%',
                  margin: '20px auto',
                  boxShadow: 'none',
                  backgroundColor: 'rgba(255, 255, 255, 0.5)',
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
                  background-size="cover"
                  component="img"
                  height="140"
                  image={`http://localhost:8080/${product.imagePath}`}
                  alt={product.name}
                />

                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ flex: 1, mr: 2 }}>
                      <Typography color="black" noWrap sx={{ fontSize: '20px' }}>
                        {product.name}
                      </Typography>

                      <Typography
                        variant="body1"
                        color="textSecondary"
                        sx={{
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          maxWidth: '180px',
                          fontSize: '15px',
                        }}
                      >
                        {product.pdtDescription}
                      </Typography>
                    </Box>

                    <Typography variant="h6" sx={{ color: 'black', whiteSpace: 'nowrap' }}>
                      <strong>₱{product.buyPrice}</strong>
                    </Typography>
                  </Box>
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