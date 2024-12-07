import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, TextField, Checkbox } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const ProductSellers = () => {
  const [productData, setProductData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortField, setSortField] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/admin/products-with-sellers');
        setProductData(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch product data.');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  if (loading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  if (error) {
    return <div style={styles.error}>Error: {error}</div>;
  }

  const filteredAndSortedData = [...productData]
    .filter(item => {
      const searchTerm = searchQuery.toLowerCase();
      return (
        String(item.product.code).toLowerCase().includes(searchTerm) ||
        String(item.product.name).toLowerCase().includes(searchTerm) ||
        String(item.product.pdtDescription).toLowerCase().includes(searchTerm) ||
        String(item.product.category).toLowerCase().includes(searchTerm) ||
        String(item.product.buyPrice).toLowerCase().includes(searchTerm) ||
        String(item.product.qtyInStock).toLowerCase().includes(searchTerm) ||
        String(item.sellerUsername).toLowerCase().includes(searchTerm)
      );
    })
    .sort((a, b) => {
      if (!sortField) return 0;
      
      let aValue, bValue;
      switch(sortField) {
        case 'code':
          aValue = a.product.code;
          bValue = b.product.code;
          break;
        case 'name':
          aValue = a.product.name;
          bValue = b.product.name;
          break;
        case 'price':
          aValue = a.product.buyPrice;
          bValue = b.product.buyPrice;
          break;
        case 'seller':
          aValue = a.sellerUsername.toLowerCase();
          bValue = b.sellerUsername.toLowerCase();
          break;
        default:
          return 0;
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Product Management</h1>
      </header>

      <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center' }}>
        <TextField
          placeholder="Search products..."
          size="small"
          value={searchQuery}
          onChange={handleSearch}
          sx={{ 
            flexGrow: 1,
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'white',
              '& fieldset': {
                borderColor: 'transparent'
              },
              '&:hover fieldset': {
                borderColor: 'transparent'
              },
              '&.Mui-focused fieldset': {
                borderColor: 'transparent'
              }
            }
          }}
          InputProps={{
            startAdornment: <SearchIcon sx={{ color: 'action.active', mr: 1 }} />,
          }}
        />
      </Box>

      <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
        <Table sx={{ minWidth: 650 }} size="small">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox" sx={{ py: 2, fontWeight: 'bold', bgcolor: '#f5f5f5' }}>
                <Checkbox />
              </TableCell>
              <TableCell 
                onClick={() => handleSort('code')}
                sx={{ 
                  cursor: 'pointer',
                  color: sortField === 'code' ? '#89343b' : 'inherit',
                  py: 2,
                  px: 2,
                  fontWeight: 'bold',
                  bgcolor: '#f5f5f5'
                }}
              >
                Code {sortField === 'code' ? (sortDirection === 'asc' ? '▲' : '▼') : '▲'}
              </TableCell>
              <TableCell sx={{ py: 2, px: 2, fontWeight: 'bold', bgcolor: '#f5f5f5' }}>Image</TableCell>
              <TableCell 
                onClick={() => handleSort('name')}
                sx={{ 
                  cursor: 'pointer',
                  color: sortField === 'name' ? '#89343b' : 'inherit',
                  py: 2,
                  px: 2,
                  fontWeight: 'bold',
                  bgcolor: '#f5f5f5'
                }}
              >
                Product Name {sortField === 'name' ? (sortDirection === 'asc' ? '▲' : '▼') : '▲'}
              </TableCell>
              <TableCell sx={{ py: 2, px: 2, fontWeight: 'bold', bgcolor: '#f5f5f5' }}>Description</TableCell>
              <TableCell sx={{ py: 2, px: 2, fontWeight: 'bold', bgcolor: '#f5f5f5' }}>Stock</TableCell>
              <TableCell 
                onClick={() => handleSort('price')}
                sx={{ 
                  cursor: 'pointer',
                  color: sortField === 'price' ? '#89343b' : 'inherit',
                  py: 2,
                  px: 2,
                  fontWeight: 'bold',
                  bgcolor: '#f5f5f5'
                }}
              >
                Price {sortField === 'price' ? (sortDirection === 'asc' ? '▲' : '▼') : '▲'}
              </TableCell>
              <TableCell sx={{ py: 2, px: 2, fontWeight: 'bold', bgcolor: '#f5f5f5' }}>Category</TableCell>
              <TableCell 
                onClick={() => handleSort('seller')}
                sx={{ 
                  cursor: 'pointer',
                  color: sortField === 'seller' ? '#89343b' : 'inherit',
                  py: 2,
                  px: 2,
                  fontWeight: 'bold',
                  bgcolor: '#f5f5f5'
                }}
              >
                Seller {sortField === 'seller' ? (sortDirection === 'asc' ? '▲' : '▼') : '▲'}
              </TableCell>
              <TableCell sx={{ py: 2, px: 2, fontWeight: 'bold', bgcolor: '#f5f5f5' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAndSortedData.map((item, index) => (
              <TableRow key={index}>
                <TableCell padding="checkbox" sx={{ py: 1 }}>
                  <Checkbox />
                </TableCell>
                <TableCell sx={{ py: 1 }}>{item.product.code}</TableCell>
                <TableCell sx={{ py: 1 }}>
                  <img
                    src={`http://localhost:8080/${item.product.imagePath}`}
                    alt={item.product.name}
                    style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }}
                  />
                </TableCell>
                <TableCell sx={{ py: 1 }}>{item.product.name}</TableCell>
                <TableCell sx={{ py: 1 }}>{item.product.pdtDescription}</TableCell>
                <TableCell sx={{ py: 1 }}>{item.product.qtyInStock}</TableCell>
                <TableCell sx={{ py: 1 }}>₱{item.product.buyPrice}</TableCell>
                <TableCell sx={{ py: 1 }}>{item.product.category}</TableCell>
                <TableCell sx={{ py: 1 }}>{item.sellerUsername}</TableCell>
                <TableCell sx={{ py: 1 }}>
                  <button style={styles.actionButton}>⋮</button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <footer style={styles.pagination}>
        <div>Rows per page: <select style={styles.select}><option>10</option></select></div>
        <div>1-5 of 5</div>
        <button style={styles.paginationButton}>←</button>
        <button style={styles.paginationButton}>→</button>
      </footer>
    </div>
  );
};

const styles = {
  container: {
    padding: '24px',
    backgroundColor: 'transparent',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    fontFamily: "'Inter', sans-serif",
    color: '#333',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  title: {
    color: '#8B4513',
    fontSize: '28px',
    fontWeight: 'bold',
  },
  actionButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '20px',
    color: '#555',
  },
  pagination: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: '16px',
    padding: '16px 0',
  },
  select: {
    padding: '8px',
    borderRadius: '8px',
    border: '1px solid #ddd',
  },
  paginationButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#007bff',
    fontWeight: 'bold',
  },
  loading: {
    textAlign: 'center',
    color: '#555',
    padding: '20px',
  },
  error: {
    textAlign: 'center',
    color: '#d9534f',
    padding: '20px',
  },
};

export default ProductSellers;
