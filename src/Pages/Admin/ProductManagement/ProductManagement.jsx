import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  TextField,
  Checkbox,
  TableSortLabel,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Chip,
  Snackbar,
  Alert,
  Breadcrumbs,
  Link,
  Typography,
  Button,
  IconButton,
  TablePagination,
  Grid,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import {
  FilterList as FilterListIcon,
  MoreVert as MoreVertIcon,
  FileDownload as FileDownloadIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import * as XLSX from 'xlsx';
import AddProductModal from './AddProductModal';
import EditProductModal from './EditProductModal';

const ProductSellers = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [orderBy, setOrderBy] = useState('code');
  const [order, setOrder] = useState('asc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [actionAnchorEl, setActionAnchorEl] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    stockRange: { min: '', max: '' },
    priceRange: { min: '', max: '' }
  });
  const [toast, setToast] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/admin/products-with-sellers');
        setProducts(response.data);
        setFilteredProducts(response.data);
      } catch (err) {
        console.error('Failed to fetch product data:', err);
      }
    };

    fetchProducts();
  }, []);

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    const newOrder = isAsc ? 'desc' : 'asc';
    setOrder(newOrder);
    setOrderBy(property);

    const sortedProducts = [...filteredProducts].sort((a, b) => {
      let aValue, bValue;
      
      // Handle specific properties
      if (property === 'stock') {
        aValue = Number(a.product.qtyInStock);
        bValue = Number(b.product.qtyInStock);
      } else if (property === 'price') {
        aValue = Number(a.product.buyPrice);
        bValue = Number(b.product.buyPrice);
      } else {
        aValue = a.product[property];
        bValue = b.product[property];
      }

      // String comparison for text fields
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      return newOrder === 'asc' 
        ? (aValue < bValue ? -1 : 1)
        : (aValue > bValue ? -1 : 1);
    });

    setFilteredProducts(sortedProducts);
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    
    let filtered = [...products];
    if (query) {
      filtered = filtered.filter(item => {
        const words = item.product.name.split(' ');
        return words.some(word => word.toLowerCase().startsWith(query)) ||
               item.sellerUsername.toLowerCase().includes(query);
      });
    }
    
    setFilteredProducts(filtered);
  };

  const applyFilters = (query = searchQuery, currentFilters = filters) => {
    let filtered = [...products];

    // Search filter
    if (query) {
      filtered = filtered.filter(item => 
        item.product.code.toString().toLowerCase().includes(query.toLowerCase()) ||
        item.product.name.toLowerCase().includes(query.toLowerCase()) ||
        item.sellerUsername.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Category filter
    if (currentFilters?.category) {
      filtered = filtered.filter(item => 
        item.product.category === currentFilters.category
      );
    }

    // Stock range filter
    if (currentFilters?.stockRange?.min !== '' && currentFilters?.stockRange?.min !== null) {
      filtered = filtered.filter(item => 
        item.product.qtyInStock >= Number(currentFilters.stockRange.min)
      );
    }
    if (currentFilters?.stockRange?.max !== '' && currentFilters?.stockRange?.max !== null) {
      filtered = filtered.filter(item => 
        item.product.qtyInStock <= Number(currentFilters.stockRange.max)
      );
    }

    // Price range filter
    if (currentFilters?.priceRange?.min !== '' && currentFilters?.priceRange?.min !== null) {
      filtered = filtered.filter(item => 
        item.product.buyPrice >= Number(currentFilters.priceRange.min)
      );
    }
    if (currentFilters?.priceRange?.max !== '' && currentFilters?.priceRange?.max !== null) {
      filtered = filtered.filter(item => 
        item.product.buyPrice <= Number(currentFilters.priceRange.max)
      );
    }

    setFilteredProducts(filtered);
  };

  const exportToExcel = () => {
    const exportData = filteredProducts.map(item => ({
      'Product Code': item.product.code,
      'Product Name': item.product.name,
      'Description': item.product.pdtDescription,
      'Category': item.product.category,
      'Stock': item.product.qtyInStock,
      'Price': item.product.buyPrice,
      'Seller': item.sellerUsername
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Products');
    XLSX.writeFile(wb, 'products.xlsx');
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const allIds = filteredProducts.map(item => item.product.id);
      setSelectedProducts(allIds);
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectOne = (event, product) => {
    const productId = product.product.id;
    setSelectedProducts(prev => 
      event.target.checked
        ? [...prev, productId]
        : prev.filter(id => id !== productId)
    );
  };

  const handleBulkDelete = () => {
    const remainingProducts = products.filter(item => 
      !selectedProducts.includes(item.product.code)
    );
    setProducts(remainingProducts);
    setSelectedProducts([]);
    setToast({
      open: true,
      message: `${selectedProducts.length} products have been deleted`,
      severity: 'success'
    });
  };

  const handleProductAction = (action, product) => {
    switch (action) {
      case 'edit':
        setSelectedProduct(product);
        setEditModalOpen(true);
        break;
      case 'delete':
        const remainingProducts = products.filter(p => p.product.code !== product.product.code);
        setProducts(remainingProducts);
        setToast({
          open: true,
          message: `Product ${product.product.name} has been deleted`,
          severity: 'success'
        });
        break;
      default:
        break;
    }
    setActionAnchorEl(null);
  };

  const handleAddProduct = (newProduct) => {
    const updatedProducts = [...products, newProduct];
    setProducts(updatedProducts);
    setFilteredProducts(updatedProducts);
    setToast({
      open: true,
      message: 'Product added successfully',
      severity: 'success'
    });
  };

  const handleEditProduct = (updatedProduct) => {
    const updatedProducts = products.map(product =>
      product.product.id === updatedProduct.product.id ? updatedProduct : product
    );
    setProducts(updatedProducts);
    setFilteredProducts(updatedProducts);
    setToast({
      open: true,
      message: 'Product updated successfully',
      severity: 'success'
    });
  };

  const handleDeleteProducts = async (productsToDelete) => {
    try {
      const productIds = Array.isArray(productsToDelete) 
        ? productsToDelete.map(p => p.product.id)
        : [productsToDelete.product.id];

      // Assuming your API endpoint accepts an array of IDs
      await axios.delete('http://localhost:8080/api/admin/products', {
        data: { ids: productIds }
      });

      const updatedProducts = products.filter(p => 
        !productIds.includes(p.product.id)
      );
      
      setProducts(updatedProducts);
      setFilteredProducts(updatedProducts);
      setSelectedProducts([]);
      setToast({
        open: true,
        message: `${productIds.length > 1 ? 'Products' : 'Product'} deleted successfully`,
        severity: 'success'
      });
    } catch (error) {
      console.error('Failed to delete products:', error);
      setToast({
        open: true,
        message: 'Failed to delete products',
        severity: 'error'
      });
    }
  };

  const FilterMenu = () => {
    const [tempFilters, setTempFilters] = useState(filters);

    const handleApply = () => {
      setFilters(tempFilters);
      applyFilters(searchQuery, tempFilters);
      setFilterAnchorEl(null);
    };

    const handleReset = () => {
      const resetFilters = {
        category: '',
        stockRange: { min: '', max: '' },
        priceRange: { min: '', max: '' }
      };
      setTempFilters(resetFilters);
      setFilters(resetFilters);
      applyFilters(searchQuery, resetFilters);
      setFilterAnchorEl(null);
    };

    return (
      <Menu
        anchorEl={filterAnchorEl}
        open={Boolean(filterAnchorEl)}
        onClose={() => setFilterAnchorEl(null)}
        PaperProps={{
          sx: { width: 250, mt: 1 }
        }}
      >
        <MenuItem sx={{ flexDirection: 'column', alignItems: 'stretch' }}>
          <FormControl fullWidth size="small" sx={{ mb: 1 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={tempFilters.category}
              label="Category"
              onChange={(e) => setTempFilters(prev => ({ ...prev, category: e.target.value }))}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Electronics">Electronics</MenuItem>
              <MenuItem value="Accessories">Accessories</MenuItem>
              <MenuItem value="Clothing">Clothing</MenuItem>
              <MenuItem value="Books">Books</MenuItem>
            </Select>
          </FormControl>
          
          <Typography variant="subtitle2" sx={{ mt: 1, mb: 1 }}>Stock Range</Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              size="small"
              type="number"
              label="Min"
              value={tempFilters.stockRange?.min}
              onChange={(e) => setTempFilters(prev => ({
                ...prev,
                stockRange: { ...prev.stockRange, min: e.target.value }
              }))}
            />
            <TextField
              size="small"
              type="number"
              label="Max"
              value={tempFilters.stockRange?.max}
              onChange={(e) => setTempFilters(prev => ({
                ...prev,
                stockRange: { ...prev.stockRange, max: e.target.value }
              }))}
            />
          </Box>

          <Typography variant="subtitle2" sx={{ mt: 1, mb: 1 }}>Price Range</Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              size="small"
              type="number"
              label="Min"
              value={tempFilters.priceRange?.min}
              onChange={(e) => setTempFilters(prev => ({
                ...prev,
                priceRange: { ...prev.priceRange, min: e.target.value }
              }))}
            />
            <TextField
              size="small"
              type="number"
              label="Max"
              value={tempFilters.priceRange?.max}
              onChange={(e) => setTempFilters(prev => ({
                ...prev,
                priceRange: { ...prev.priceRange, max: e.target.value }
              }))}
            />
          </Box>
        </MenuItem>
        <MenuItem sx={{ gap: 1, justifyContent: 'flex-end', pt: 2 }}>
          <Button 
            variant="outlined"
            onClick={handleReset}
            sx={{ 
              borderColor: '#89343b',
              color: '#89343b',
              '&:hover': {
                borderColor: '#6d2931',
                backgroundColor: 'rgba(137, 52, 59, 0.04)'
              }
            }}
          >
            Reset
          </Button>
          <Button 
            variant="contained"
            onClick={handleApply}
            sx={{ 
              bgcolor: '#89343b',
              '&:hover': { bgcolor: '#6d2931' }
            }}
          >
            Apply
          </Button>
        </MenuItem>
      </Menu>
    );
  };

  if (!products.length) {
    return <div style={styles.loading}>Loading...</div>;
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link color="inherit" href="/admin/dashboard">
          Dashboard
        </Link>
        <Typography color="textPrimary">Product Management</Typography>
      </Breadcrumbs>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ color: '#89343b' }}>
          Product Management
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {selectedProducts.length > 0 && (
            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteIcon sx={{ color: 'white' }} />}
              onClick={handleBulkDelete}
              sx={{ 
                '& .MuiButton-startIcon': {
                  margin: 0,
                  marginRight: '8px',
                  display: 'flex',
                  alignItems: 'center'
                }
              }}
            >
              Delete Selected ({selectedProducts.length})
            </Button>
          )}
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setAddModalOpen(true)}
            sx={{ 
              bgcolor: '#89343b',
              '&:hover': { bgcolor: '#6d2931' },
              '& .MuiButton-startIcon': {
                margin: 0,
                marginRight: '8px',
                display: 'flex',
                alignItems: 'center',
                color: 'white'
              }
            }}
          >
            Add Product
          </Button>
        </Box>
      </Box>

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

        <Button
          variant="contained"
          startIcon={<FilterListIcon />}
          onClick={(e) => setFilterAnchorEl(e.currentTarget)}
          sx={{ 
            bgcolor: '#ffd700',
            color: 'black',
            '&:hover': {
              bgcolor: '#ffcd00'
            },
            '& .MuiButton-startIcon': {
              margin: 0,
              marginRight: '8px',
              display: 'flex',
              alignItems: 'center'
            }
          }}
        >
          Filters
        </Button>

        <Button
          variant="contained"
          startIcon={<FileDownloadIcon sx={{ color: 'white' }} />}
          onClick={exportToExcel}
          sx={{ 
            bgcolor: '#89343b',
            '&:hover': { bgcolor: '#6d2931' },
            '& .MuiButton-startIcon': {
              margin: 0,
              marginRight: '8px',
              display: 'flex',
              alignItems: 'center'
            }
          }}
        >
          Export to Excel
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ mt: 3, height: 'calc(100vh - 250px)' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow sx={{ 
              '& th': { 
                bgcolor: '#f5f5f5', 
                fontWeight: 'bold',
                fontSize: '0.875rem',
                color: 'rgba(0, 0, 0, 0.87)',
                '& .MuiTableSortLabel-root': {
                  fontSize: '0.875rem',
                  display: 'flex',
                  alignItems: 'center',
                  '&.Mui-active': {
                    color: '#89343b',
                  },
                },
                '& .MuiTableSortLabel-icon': {
                  opacity: 1,
                }
              } 
            }}>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={selectedProducts.length > 0 && selectedProducts.length < filteredProducts.length}
                  checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'code'}
                  direction={orderBy === 'code' ? order : 'asc'}
                  onClick={() => handleSort('code')}
                >
                  Code
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'name'}
                  direction={orderBy === 'name' ? order : 'asc'}
                  onClick={() => handleSort('name')}
                >
                  Product Name
                </TableSortLabel>
              </TableCell>
              <TableCell>Description</TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'stock'}
                  direction={orderBy === 'stock' ? order : 'asc'}
                  onClick={() => handleSort('stock')}
                >
                  Stock
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'price'}
                  direction={orderBy === 'price' ? order : 'asc'}
                  onClick={() => handleSort('price')}
                >
                  Price
                </TableSortLabel>
              </TableCell>
              <TableCell>Category</TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'seller'}
                  direction={orderBy === 'seller' ? order : 'asc'}
                  onClick={() => handleSort('seller')}
                  sx={{ display: 'flex !important' }}
                >
                  Seller
                </TableSortLabel>
              </TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProducts.map((item, index) => (
              <TableRow key={index}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedProducts.includes(item.product.id)}
                    onChange={(e) => {
                      const productId = item.product.id;
                      setSelectedProducts(prev => 
                        e.target.checked 
                          ? [...prev, productId]
                          : prev.filter(id => id !== productId)
                      );
                    }}
                  />
                </TableCell>
                <TableCell sx={{ py: 1 }}>{item.product.code}</TableCell>
                <TableCell sx={{ py: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <img 
                      src={`http://localhost:8080/${item.product.imagePath}`}
                      alt={item.product.name}
                      style={{ width: 50, height: 50, objectFit: 'cover' }}
                    />
                    {item.product.name}
                  </Box>
                </TableCell>
                <TableCell sx={{ py: 1 }}>{item.product.pdtDescription}</TableCell>
                <TableCell sx={{ py: 1 }}>{item.product.qtyInStock}</TableCell>
                <TableCell sx={{ py: 1 }}>₱{item.product.buyPrice}</TableCell>
                <TableCell sx={{ py: 1 }}>{item.product.category}</TableCell>
                <TableCell sx={{ py: 1 }}>{item.sellerUsername}</TableCell>
                <TableCell>
                  <IconButton onClick={(e) => {
                    setSelectedProduct(item);
                    setActionAnchorEl(e.currentTarget);
                  }}>
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={filteredProducts.length}
        page={page}
        onPageChange={(e, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
      />

      <FilterMenu />

      <Menu
        anchorEl={actionAnchorEl}
        open={Boolean(actionAnchorEl)}
        onClose={() => setActionAnchorEl(null)}
      >
        <MenuItem onClick={() => handleProductAction('edit', selectedProduct)}>
          <EditIcon sx={{ mr: 1 }} /> Edit Product
        </MenuItem>
        <MenuItem 
          onClick={() => handleProductAction('delete', selectedProduct)}
          sx={{ color: 'error.main' }}
        >
          <DeleteIcon sx={{ mr: 1 }} /> Delete Product
        </MenuItem>
      </Menu>

      <EditProductModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        product={selectedProduct}
        onSave={(updatedProduct) => {
          const updatedProducts = products.map(product =>
            product.product.id === updatedProduct.product.id ? updatedProduct : product
          );
          setProducts(updatedProducts);
          setFilteredProducts(updatedProducts);
          setToast({
            open: true,
            message: 'Product updated successfully',
            severity: 'success'
          });
        }}
      />

      <AddProductModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAdd={(newProduct) => {
          const updatedProducts = [...products, newProduct];
          setProducts(updatedProducts);
          setFilteredProducts(updatedProducts);
          setToast({
            open: true,
            message: 'Product added successfully',
            severity: 'success'
          });
        }}
      />

      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={toast.severity}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
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