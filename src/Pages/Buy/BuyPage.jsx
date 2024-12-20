import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography, Card, CardContent, CardMedia, Avatar, FormControl, InputLabel, Select, MenuItem, InputBase, IconButton, Menu, Button } from '@mui/material';
import { Search as SearchIcon, FilterList as FilterListIcon } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { styled } from '@mui/system';

const Search = styled('div')({
  position: 'relative',
  borderRadius: '4px',
  backgroundColor: '#f5f5f5',
  '&:hover': {
    backgroundColor: '#eeeeee',
  },
  marginLeft: 0,
  width: '30%',
  height: '40px',
  display: 'flex',
  alignItems: 'center',
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
  const [tempFilters, setTempFilters] = useState({
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
    setTempFilters((prevFilters) => ({ ...prevFilters, [key]: value }));
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

  const handleApplyFilters = () => {
    setFilters(tempFilters);
    
    const params = new URLSearchParams();
    if (tempFilters.category) params.set('category', tempFilters.category);
    if (tempFilters.status) params.set('status', tempFilters.status);
    if (tempFilters.conditionType) params.set('condition', tempFilters.conditionType);
    if (searchTerm) params.set('search', searchTerm);
    
    navigate({
      pathname: location.pathname,
      search: params.toString()
    });
    
    handleFilterClose();
  };

  const handleClearFilters = () => {
    const emptyFilters = {
      category: '',
      status: '',
      conditionType: '',
    };
    setFilters(emptyFilters);
    setTempFilters(emptyFilters);
    setFilteredProducts(allProducts);
    
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    
    navigate({
      pathname: location.pathname,
      search: params.toString()
    });
  };

  useEffect(() => {
    const fetchAllProducts = async () => {
      setLoading(true); 
      
      try {
        const response = await axios.get(`http://localhost:8080/api/product/getAllProducts/${loggedInUser}`);
        if (response.status === 200) {
          const approvedProducts = response.data.filter(product => product.status && product.status.toLowerCase() === 'approved');
          const { sellerPhoto } = response.data;
          setAllProducts(approvedProducts);
          setFilteredProducts(approvedProducts);
        }
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
      const searchedProducts = allProducts.filter((product) =>
        product.name.toLowerCase().includes(lowerCaseSearchTerm) ||
        product.name.toLowerCase().split(' ').some(word => 
          word.startsWith(lowerCaseSearchTerm)
        )
      );
      setFilteredProducts(searchedProducts);
    } else {
      setFilteredProducts(prevFilteredProducts => 
        filters.category || filters.status || filters.conditionType 
          ? prevFilteredProducts 
          : allProducts
      );
    }
  }, [searchTerm, allProducts, filters]);

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
              borderRadius: '8px',
              boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)',
              padding: '16px',
              width: '320px',
            },
          }}
        >
          <Box sx={{ padding: 2 }}>
            <FormControl fullWidth sx={{ marginBottom: 2 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={tempFilters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                label="Category"
                sx={{
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#e0e0e0',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#89343b',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#89343b',
                  },
                }}
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
                value={tempFilters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                label="Status"
                sx={{
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#e0e0e0',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#89343b',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#89343b',
                  },
                }}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Available">Available</MenuItem>
                <MenuItem value="Sold">Sold</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ marginBottom: 2 }}>
              <InputLabel>Condition</InputLabel>
              <Select
                value={tempFilters.conditionType}
                onChange={(e) => handleFilterChange('conditionType', e.target.value)}
                label="Condition"
                sx={{
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#e0e0e0',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#89343b',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#89343b',
                  },
                }}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Brand New">Brand New</MenuItem>
                <MenuItem value="Pre-Loved">Pre-Loved</MenuItem>
                <MenuItem value="None">None</MenuItem>
              </Select>
            </FormControl>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button 
                onClick={handleClearFilters} 
                variant="outlined" 
                sx={{ 
                  width: '50%',
                  borderColor: '#89343b',
                  color: '#89343b',
                  '&:hover': {
                    borderColor: '#6b2831',
                    backgroundColor: 'rgba(137, 52, 59, 0.04)',
                  }
                }}
              >
                Clear
              </Button>
              <Button 
                onClick={handleApplyFilters} 
                variant="contained" 
                sx={{ 
                  width: '50%', 
                  bgcolor: '#89343b', 
                  '&:hover': { 
                    bgcolor: '#6b2831' 
                  } 
                }}
              >
                Apply
              </Button>
            </Box>
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
                  <Avatar
                    src={`http://localhost:8080/profile-images/${product.sellerPhoto}`} // Construct full URL
                    alt={product.sellerUsername}
                  />
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

      {/* Footer Section */}
      <Box sx={{ padding: "20px", textAlign: "center" }}>
        <Typography variant="body2" sx={{ color: "#555" }}>
          © 2024 CIT-U Marketplace. All Rights Reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default BuyPage;