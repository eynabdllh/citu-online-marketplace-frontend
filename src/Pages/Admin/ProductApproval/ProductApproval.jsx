import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TablePagination, TableRow, Button, CircularProgress, Snackbar, Link,
  Breadcrumbs, Card, CardMedia, CardContent, Tooltip, Chip, TableSortLabel, TextField,
  FormControl, InputLabel, Select, MenuItem, Grid, Dialog, DialogActions, DialogContent, DialogTitle, Alert
} from '@mui/material';
import { Search as SearchIcon, CheckCircle, Cancel, AccessTime } from '@mui/icons-material';
import axios from 'axios';
import ToastManager from '../../../components/ToastManager';

const columns = [
  { id: 'user', label: 'Username', minWidth: 170, sortable: true },
  { id: 'image', label: 'Image', minWidth: 120, sortable: false },
  { id: 'productName', label: 'Product Name', minWidth: 170, sortable: true },
  { id: 'productCode', label: 'Product Code', minWidth: 100, sortable: true },
  { id: 'category', label: 'Category', minWidth: 170, sortable: true },
  { id: 'status', label: 'Approval Status', minWidth: 170, sortable: false },
];

const createData = (productName, user, productCode, category, status, image) => {
  const formatStatus = (status) => {
    if (status === 'approved') return 'Approved';
    if (status === 'rejected') return 'Rejected';
    if (status === 'Available') return 'Pending';
    return status;
  };

  const imageUrl = image ? `http://localhost:8080/${image}` : null;

  return { productName, user, productCode, category, status: formatStatus(status), image: imageUrl };
};

const ProductApproval = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [summary, setSummary] = useState({ pending: 0, approved: 0, rejected: 0 });
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('user');
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:8080/api/product/pendingApproval');
        console.log("Products: ", response.data)
        const productData = response.data.map((product) =>
          createData(
            product.productName,
            product.sellerUsername,
            product.productCode,
            product.category,
            product.status,
            product.image
          )
        );
        setProducts(productData);
        updateSummary(productData);
      } catch (error) {
        setError('Error fetching products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleProductClick = (product) => {
    setSelectedProduct(product); 
    setOpenModal(true); 
  };

  const handleCloseModal = () => {
    setOpenModal(false); 
  };

  const handleApproveInModal = async () => {
    if (selectedProduct) {
      await handleApprove(selectedProduct.productCode);
      handleCloseModal(); // Close modal after approval
    }
  };

  const handleRejectInModal = async () => {
    if (selectedProduct) {
      await handleReject(selectedProduct.productCode);
      handleCloseModal(); // Close modal after rejection
    }
  };

  const updateSummary = (data) => {
    const approved = data.filter(p => p.status === 'Approved').length;
    const rejected = data.filter(p => p.status === 'Rejected').length;
    const pending = data.filter(p => p.status === 'Pending').length;
    setSummary({ approved, rejected, pending });
  };

  const handleApprove = async (productCode) => {
    try {
      const response = await axios.post('http://localhost:8080/api/product/approve', { productCode });
      showToast('Product approved successfully!', 'success');

      setProducts((prevProducts) => {
        const updatedProducts = prevProducts.map(product =>
          product.productCode === productCode
            ? { ...product, status: 'Approved' }
            : product
        );
        updateSummary(updatedProducts);
        return updatedProducts;
      });
    } catch (error) {
      showToast('Error approving product', 'error');
    }
  };

  const handleReject = async (productCode) => {
    try {
      const response = await axios.post('http://localhost:8080/api/product/reject', { productCode });
      showToast('Product rejected successfully!', 'success');

      setProducts((prevProducts) => {
        const updatedProducts = prevProducts.map(product =>
          product.productCode === productCode
            ? { ...product, status: 'Rejected' }
            : product
        );
        updateSummary(updatedProducts);
        return updatedProducts;
      });
    } catch (error) {
      showToast('Error rejecting product', 'error');
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filterProducts = (products) => {
    if (!searchTerm && !statusFilter) return products;

    return products.filter((product) => {
      const productName = product.productName ? String(product.productName).toLowerCase() : '';
      const user = product.user ? String(product.user).toLowerCase() : '';
      const productCode = product.productCode ? String(product.productCode).toLowerCase() : '';
      const category = product.category ? String(product.category).toLowerCase() : '';
      const status = product.status ? String(product.status).toLowerCase() : '';

      const search = searchTerm.toLowerCase();
      const matchesSearch = (
        productName.includes(search) ||
        user.includes(search) ||
        productCode.includes(search) ||
        category.includes(search) ||
        status.includes(search)
      );
      const matchesStatus = statusFilter ? status.includes(statusFilter.toLowerCase()) : true;

      return matchesSearch && matchesStatus;
    });
  };

  const getStatusChipProps = (status) => {
    const props = {
      label: status === 'Blocked' || status === 'Block' ? 'Blocked' : status,
      sx: {
        width: '80px',
        height: '24px',
        color: 'white',
        fontWeight: 500,
        '& .MuiChip-label': {
          color: 'white',
          padding: 0,
          display: 'flex',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '15px',
          marginTop: '18px'
        }
      }
    };

    switch (status) {
      case 'Pending':
        return {
          ...props,
          sx: {
            ...props.sx,
            bgcolor: '#28a745',
            '&:hover': { bgcolor: '#28a745' }
          }
        };
      case 'Approved':
        return {
          ...props,
          sx: {
            ...props.sx,
            bgcolor: '#007bff',
            '&:hover': { bgcolor: '#007bff' }
          }
        };
      case 'Rejected':
        return {
          ...props,
          sx: {
            ...props.sx,
            bgcolor: '#dc3545',
            '&:hover': { bgcolor: '#dc3545' }
          }
        };
      default:
        return props;
    }
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortData = (data) => {
    const sortedData = [...data];
    sortedData.sort((a, b) => {
      const getStringValue = (value) => (value ? String(value) : "");

      if (orderBy === 'user') {
        return order === 'asc' ? getStringValue(a.user).localeCompare(getStringValue(b.user)) : getStringValue(b.user).localeCompare(getStringValue(a.user));
      }
      if (orderBy === 'productName') {
        return order === 'asc' ? getStringValue(a.productName).localeCompare(getStringValue(b.productName)) : getStringValue(b.productName).localeCompare(getStringValue(a.productName));
      }
      if (orderBy === 'productCode') {
        return order === 'asc' ? getStringValue(a.productCode).localeCompare(getStringValue(b.productCode)) : getStringValue(b.productCode).localeCompare(getStringValue(a.productCode));
      }
      if (orderBy === 'category') {
        return order === 'asc' ? getStringValue(a.category).localeCompare(getStringValue(b.category)) : getStringValue(b.category).localeCompare(getStringValue(a.category));
      }
      if (orderBy === 'status') {
        return order === 'asc' ? getStringValue(a.status).localeCompare(getStringValue(b.status)) : getStringValue(b.status).localeCompare(getStringValue(a.status));
      }
      return 0;
    });
    return sortedData;
  };

  const showToast = (message, severity = 'success') => {
    const newToast = {
      id: Date.now(),
      message,
      severity,
      open: true
    };
    setToasts(current => [newToast, ...current].slice(0, 2));
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ color: '#89343b' }}>
          Product Approval
        </Typography>
      </Box>

      {/* Filter Section */}
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          {/* Search Input */}
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              placeholder="Search..."
              size="small"
              value={searchTerm}
              onChange={handleSearchChange}
              sx={{
                width: '100%',
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'white',
                  '& fieldset': {
                    borderColor: 'transparent',
                  },
                  '&:hover fieldset': {
                    borderColor: 'transparent',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'transparent',
                  },
                },
              }}
              InputProps={{
                startAdornment: <SearchIcon sx={{ color: 'action.active', mr: 1 }} />,
              }}
            />
          </Grid>

          {/* Approval Status Filter */}
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth size="small" sx={{ position: 'relative' }}>
              <InputLabel sx={{
                color: 'Black',
                '&.Mui-focused': {
                  color: 'Black',
                }
              }}>Approval Status</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="Approval Status"
                sx={{
                  width: '50%',
                  backgroundColor: '#ffd700',
                  boxShadow: 'none',
                  border: 'none',
                  '& .MuiOutlinedInput-notchedOutline': {
                    border: 'none',
                  },
                  '&:hover': {
                    backgroundColor: '#ffcd00',
                    boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)',
                  },
                  '&.Mui-focused': {
                    backgroundColor: '#e0e0e0',
                    boxShadow: 'none',
                  },
                  '& .MuiSelect-icon': {
                    color: '#8A252C',
                  },
                }}
              >
                <MenuItem value="">
                  <em>All</em>
                </MenuItem>
                <MenuItem value="Approved">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CheckCircle sx={{ mr: 1, color: '#28a745' }} />
                    <Typography variant="body2" sx={{ color: '#333' }}>Approved</Typography>
                  </Box>
                </MenuItem>
                <MenuItem value="Rejected">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Cancel sx={{ mr: 1, color: '#dc3545' }} />
                    <Typography variant="body2" sx={{ color: '#333' }}>Rejected</Typography>
                  </Box>
                </MenuItem>
                <MenuItem value="Pending">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AccessTime sx={{ mr: 1, color: '#ff9800' }} />
                    <Typography variant="body2" sx={{ color: '#333' }}>Pending</Typography>
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>

        </Grid>
      </Box>

      {/* Summary Cards */}
      <Box sx={{ display: 'flex', gap: 2, my: 2 }}>
        <Card sx={{ p: 2, flex: 1, bgcolor: '#ffefc3' }}>
          <Typography variant="subtitle1">Pending</Typography>
          <Typography variant="h4">{summary.pending}</Typography>
        </Card>
        <Card sx={{ p: 2, flex: 1, bgcolor: '#c8e6c9' }}>
          <Typography variant="subtitle1">Approved</Typography>
          <Typography variant="h4">{summary.approved}</Typography>
        </Card>
        <Card sx={{ p: 2, flex: 1, bgcolor: '#ffcdd2' }}>
          <Typography variant="subtitle1">Rejected</Typography>
          <Typography variant="h4">{summary.rejected}</Typography>
        </Card>
      </Box>


      {/* Product Table */}
      <Paper>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
            <CircularProgress />
          </Box>
        ) : (
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
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align="left"
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.sortable ? (
                        <TableSortLabel
                          active={orderBy === column.id}
                          direction={orderBy === column.id ? order : 'asc'}
                          onClick={(event) => handleRequestSort(event, column.id)}
                        >
                          {column.label}
                        </TableSortLabel>
                      ) : (
                        column.label
                      )}
                    </TableCell>
                  ))}
                  <TableCell key="actions" align="left" sx={{ backgroundColor: '#f4f4f4', borderBottom: '2px solid #ddd' }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortData(filterProducts(products))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => (
                    <TableRow hover role="checkbox" tabIndex={-1} key={index} onClick={() => handleProductClick(row)} sx={{ cursor: 'pointer', '&:hover': { backgroundColor: '#fafafa' } }}>
                      {columns.map((column) => {
                        const value = row[column.id];

                        if (column.id === 'image') {
                          return (
                            <TableCell key={column.id} align="left" sx={{ padding: '16px' }}>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                {row.image && (
                                  <img src={row.image} alt={row.productName} style={{ width: 50, height: 50, objectFit: 'cover', marginRight: 10 }} />
                                )}
                              </Box>
                            </TableCell>
                          );
                        }

                        if (column.id === 'status') {
                          const statusProps = getStatusChipProps(value);
                          return (
                            <TableCell key={column.id} align="left" sx={{ padding: '16px' }}>
                              <Chip {...statusProps} />
                            </TableCell>
                          );
                        }

                        return (
                          <TableCell key={column.id} align="left" sx={{ padding: '16px' }}>
                            {value}
                          </TableCell>
                        );
                      })}
                      <TableCell align="left" sx={{ padding: '16px' }}>
                        <Tooltip title="Approve">
                          <Button
                            variant="outlined"
                            color="success"
                            startIcon={<CheckCircle />}
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent row click event from firing
                              handleApprove(row.productCode);
                            }}
                            sx={{
                              marginRight: 1,
                              padding: '4px 12px',
                              fontSize: '0.875rem',
                              borderRadius: 2,
                              textTransform: 'capitalize',
                              '&:hover': {
                                backgroundColor: '#66bb6a',
                                color: '#fff',
                              },
                            }}
                            size="small"
                          >
                            Approve
                          </Button>
                        </Tooltip>
                        <Tooltip title="Reject">
                          <Button
                            variant="outlined"
                            color="error"
                            startIcon={<Cancel />}
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent row click event from firing
                              handleReject(row.productCode)
                            }}
                            sx={{
                              padding: '4px 12px',
                              fontSize: '0.875rem',
                              borderRadius: 2,
                              textTransform: 'capitalize',
                              '&:hover': {
                                backgroundColor: '#ef5350',
                                color: '#fff',
                              },
                            }}
                            size="small"
                          >
                            Reject
                          </Button>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={products.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            backgroundColor: '#f4f4f4',
            borderTop: '2px solid #ddd',
            '& .MuiTablePagination-selectIcon': { color: '#555' },
            '& .MuiTablePagination-caption': { color: '#555' },
          }}
        />
      </Paper>

      {/* Enhanced Product Details Modal */}
      <Dialog 
        open={openModal} 
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '12px',
            padding: '16px'
          }
        }}
      >
        <DialogTitle sx={{ 
          borderBottom: '1px solid #e0e0e0',
          pb: 2,
          fontSize: '1.5rem',
          fontWeight: 600
        }}>
          Product Details
        </DialogTitle>
        <DialogContent sx={{ mt: 2, height: '300px' }}>
          {selectedProduct && (
            <Grid container spacing={3} sx={{ height: '100%' }}>
              {/* Product Image */}
              <Grid item xs={12} md={4} sx={{ height: '100%' }}>
                <Box sx={{ 
                  width: '100%',
                  height: '100%',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  border: '1px solid #e0e0e0'
                }}>
                  {selectedProduct.image ? (
                    <img 
                      src={selectedProduct.image} 
                      alt={selectedProduct.productName}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  ) : (
                    <Box sx={{ 
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: '#f5f5f5'
                    }}>
                      <Typography color="text.secondary">
                        No image available
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Grid>

              {/* Product Details */}
              <Grid item xs={12} md={8} sx={{ height: '270px' }}>
                <Box sx={{ 
                  p: 2, 
                  bgcolor: '#f8f9fa',
                  borderRadius: '8px',
                  border: '1px solid #e0e0e0',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <Typography variant="h6" sx={{ color: '#1a237e', mb: 3 }}>
                    {selectedProduct.productName}
                  </Typography>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Product Code
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 2, fontWeight: 500 }}>
                        {selectedProduct.productCode}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Category
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 2, fontWeight: 500 }}>
                        {selectedProduct.category}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Seller
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 2, fontWeight: 500 }}>
                        {selectedProduct.user}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Status
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 2, fontWeight: 500 }}>
                        {selectedProduct.status}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ 
          borderTop: '1px solid #e0e0e0',
          pt: 2,
          px: 3 
        }}>
          <Button 
            onClick={handleCloseModal} 
            variant="outlined"
            sx={{ 
              borderColor: '#89343b',
              color: '#89343b',
              '&:hover': {
                borderColor: '#6d2931',
                backgroundColor: 'rgba(137, 52, 59, 0.04)'
              }
            }}
          >
            Close
          </Button>
          <Button 
            onClick={handleApproveInModal}
            variant="contained"
            color="success"
            sx={{ ml: 1 }}
            disabled={selectedProduct?.status === 'Approved'}
          >
            Approve
          </Button>
          <Button 
            onClick={handleRejectInModal}
            variant="contained"
            color="error"
            sx={{ ml: 1 }}
            disabled={selectedProduct?.status === 'Rejected'}
          >
            Reject
          </Button>
        </DialogActions>
      </Dialog>

      {/* Updated Toast Message */}
      <ToastManager toasts={toasts} handleClose={(id) => {
        setToasts(current => 
          current.map(toast => 
            toast.id === id ? { ...toast, open: false } : toast
          )
        );
      }} />
    </Box>
  );
};

export default ProductApproval;
