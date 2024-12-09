import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CardMedia,
  TextField,
  InputAdornment,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loggedInUser = sessionStorage.getItem("username") || "User";
  const firstName = loggedInUser.split(" ")[0];

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = () => {
    navigate(`/buy?search=${searchQuery}`);
  };

  const handleCategoryClick = (category) => {
    navigate(`/buy?category=${category}`);
  };

  const handleCardClick = (code) => {
    navigate(`/product/${code}`);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/product/getAllProducts/${loggedInUser}`);
        setProducts(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      }
    };

    fetchProducts();
  }, []);

  const sortedProducts = Array.isArray(products) 
    ? [...products]
      .reverse()
      .slice(0, 12)
    : [];

  return (
    <>
      <Box
        sx={{
          width: "auto",
          position: "relative",
          padding: { xs: "16px", sm: "240px", md: "120px" },
          borderRadius: "8px",
          mt: 4,
          mx: "4%",
          backgroundImage: `url('/images/homepage.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          "&:before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1,
            borderRadius: "8px",
          },
          zIndex: 2,
        }}
      >
        <Typography
          variant="h2"
          align="center"
          sx={{
            fontWeight: "bold",
            mt: 2,
            zIndex: 2,
            marginBottom: 3,
            color: "white",
          }}
        >
          Welcome, {firstName}!
        </Typography>

        {/* Search Bar */}
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3, zIndex: 2 }}>
          <TextField
            variant="outlined"
            placeholder="What are you looking for?"
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
            sx={{
              width: "700px",
              bgcolor: "white",
              borderRadius: "4px",
              border: "2px solid #ffd700",
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon
                    onClick={handleSearchSubmit}
                    style={{ cursor: "pointer" }}
                  />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Scrollable Category Buttons */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            mt: 2,
            overflowX: "auto",
            whiteSpace: "nowrap",
            paddingBottom: 2,
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": {
              display: "none",
            },
            zIndex: 2,
          }}
        >
          {[
            "Food",
            "Clothes",
            "Accessories",
            "Stationery",
            "Merchandise",
            "Supplies",
            "Electronics",
            "Beauty",
            "Books",
            "Other",
          ].map((category) => (
            <Button
              variant="outlined"
              key={category}
              onClick={() => handleCategoryClick(category)}
              sx={{
                fontWeight: "bold",
                border: "2px solid #ffd700",
                color: "#ffd700",
                whiteSpace: "nowrap",
              }}
            >
              {category}
            </Button>
          ))}
        </Box>
      </Box>

      {/* Recently Listed Products */}
      <Box sx={{ mt: 4, mb: 3, px: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2, ml: 2 }}>
          Recently Listed
        </Typography>
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            overflowX: 'auto',
            ml: 2,
            pb: 2,
            '&::-webkit-scrollbar': {
                height: '8px',
            },
            '&::-webkit-scrollbar-track': {
                background: '#f1f1f1',
                borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb': {
                background: '#89343b',
                borderRadius: '4px',
                '&:hover': {
                    background: '#6d2931',
                },
            },
            scrollbarWidth: 'thin',
            scrollbarColor: '#89343b #f1f1f1',
            overflowY: 'hidden',
            '&': {
                scrollBehavior: 'smooth',
            },
            '&:hover': {
                cursor: 'grab',
            }
          }}
          onWheel={(e) => {
            const container = e.currentTarget;
            if (e.deltaY !== 0) {
                e.preventDefault();
                container.scrollLeft += e.deltaY;
            }
          }}
        >
          {Array.isArray(sortedProducts) && sortedProducts.length > 0 ? (
            sortedProducts
              .slice(0, 12)
              .map((product) => (
                <Box
                  key={product.code}
                  sx={{
                    flex: "0 0 auto",
                    width: "200px",
                    height: "300px",
                    position: "relative",
                    overflow: "hidden",
                    borderRadius: "8px",
                    cursor: "pointer",
                    transition: "0.3s",
                    "&:hover .overlay": {
                      opacity: 1,
                    },
                  }}
                  onClick={() => handleCardClick(product.code)}
                >
                  {/* Product Image */}
                  <CardMedia
                    component="img"
                    image={`http://localhost:8080/${product.imagePath}`}
                    alt={product.name}
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                  {/* Hover Overlay */}
                  <Box
                    className="overlay"
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      bgcolor: "rgba(0, 0, 0, 0.6)",
                      color: "white",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      opacity: 0,
                      transition: "opacity 0.3s ease-in-out",
                    }}
                  >
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                      {product.name}
                    </Typography>
                    <Typography variant="h6">PHP {product.buyPrice}</Typography>
                  </Box>
                </Box>
              ))
          ) : (
            <Typography variant="h6" sx={{ textAlign: "center", mt: 4, ml: 10 }}>
              No products to display.
            </Typography>
          )}
        </Box>
      </Box>
    </>
  );
}

export default HomePage;