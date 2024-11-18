import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Avatar,
  CardContent,
  Card,
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
  const firstName = loggedInUser.split(" ")[0]; // Extract the first name if multiple names

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
        const response = await axios.get(
          `http://localhost:8080/api/product/getAllProducts/${loggedInUser}`
        );
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
          sx={{ fontWeight: "bold", mt: 2, zIndex: 2, marginBottom: 3, color: "white" }}
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
            sx={{ width: "700px", bgcolor: "white", borderRadius: "4px", border: "2px solid #ffd700" }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon onClick={handleSearchSubmit} style={{ cursor: "pointer" }} />
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
            scrollbarWidth: "none", // Hide scrollbar for all modern browsers
            "&::-webkit-scrollbar": {
              display: "none", // Hide scrollbar for Chrome, Safari, and Edge
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
      <Box sx={{ mt: 4, marginBottom: 3, overflowX: "auto", whiteSpace: "nowrap", px: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2, marginLeft: 2 }}>
          Listed Recently
        </Typography>
        <Grid container spacing={2} sx={{ display: "inline-flex" }}>
          {Array.isArray(products) && products.length > 0 ? (
            products.map((product) => (
              <Card
                key={product.code}
                onClick={() => handleCardClick(product.code)}
                sx={{
                  minWidth: "240px",
                  marginRight: "20px",
                  backgroundColor: "white",
                  boxShadow: "none",
                  transition: "0.3s",
                  "&:hover": {
                    boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
                  },
                }}
              >
                <Box
                  sx={{ display: "flex", alignItems: "center", margin: "5px", color: "gray", padding: "10px" }}
                >
                  <Avatar />
                  <Box sx={{ ml: 1 }}>
                    <Typography
                      variant="subtitle1"
                      color="black"
                      sx={{ lineHeight: 1, mb: 0, fontWeight: 500 }}
                    >
                      {product.sellerUsername}
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      color="gray"
                      sx={{ mt: 0, fontSize: "12px" }}
                    >
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
                  <Typography variant="h6" noWrap sx={{ mt: 0, fontWeight: "bold" }}>
                    PHP {product.buyPrice}
                  </Typography>
                  <Typography variant="body1">{product.pdtDescription}</Typography>
                </CardContent>
              </Card>
            ))
          ) : (
            <Typography variant="h6" sx={{ textAlign: "center", marginTop: 4, marginLeft: 10 }}>
              No products to display.
            </Typography>
          )}
        </Grid>
      </Box>
    </>
  );
}

export default HomePage;
