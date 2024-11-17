import React, { useState, useEffect } from "react";
import { useNavigate, Link } from 'react-router-dom';
import { Box, InputBase, Button, Typography, Grid, Card, CardMedia, CardContent, Avatar } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FavoriteIcon from '@mui/icons-material/Favorite';
import axios from 'axios';

const SearchBar = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  const handleCardClick = (code) => {
    navigate(`product/${code}`);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/product/getAllProducts');
        //setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        //setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", width: "100%", marginTop: "10px" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          width: "95%",
          margin: "5px",
          marginLeft: "30px"
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            border: "1px solid #ddd",
            borderRadius: 2,
            backgroundColor: "white",
            boxShadow: 1,
            flex: 1,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              paddingX: 1.5,
              color: "gray",
            }}
          >
            <SearchIcon />
          </Box>
          <InputBase
            placeholder="Search for an item"
            value={query}
            onChange={handleInputChange}
            sx={{
              flex: 1,
              paddingY: 1,
              paddingX: 1,
              fontSize: "16px",
            }}
          />
        </Box>
        <Box sx={{ marginLeft: "10px" }}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#89343b",
              color: "white",
              borderRadius: "3px",
              textTransform: "none",
              fontWeight: "bold",
              paddingX: 2,
              height: "40px",
              '&:hover': {
                backgroundColor: "#b24d57",
              },
            }}
          >
            Search
          </Button>
        </Box>
      </Box>

      <Typography variant="h4" sx={{ marginTop: "15px", color: "primary", fontWeight: '400', marginLeft: "30px" }}>
        Likes
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={2.4}>
          <Card
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
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                margin: '5px',
                color: 'gray',
                padding: '10px'
              }}
            >
              <Avatar />
              <Box sx={{ ml: 1}}> {/* Reduce line height to decrease space */}
                {/* Username and date with reduced spacing and black color */}
                <Typography variant="subtitle1" color="black" sx={{ lineHeight: 1, mb: 0, fontWeight: 500 }}>karenleankay</Typography>
                <Typography variant="subtitle2" color="gray" sx={{ mt: 0, fontSize: "12px"}}>2 months ago</Typography>
              </Box>
            </Box>
            <CardMedia
              component="img"
              height="140"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/140';
              }}
            />
            <CardContent>
            <Typography color="black" noWrap>Garden Floral Appliques Champagne Maxi Dress</Typography>
              <Typography variant="h6" noWrap sx={{ mt: 0, fontWeight: "bold"}}>PHP 2,999</Typography>
              <Typography variant="body1">Condition</Typography>
              <FavoriteIcon sx={{ color: 'red' }}/>
            </CardContent>
          </Card>
        </Grid>
      </Grid>


    </Box>
  );
};

export default SearchBar;
