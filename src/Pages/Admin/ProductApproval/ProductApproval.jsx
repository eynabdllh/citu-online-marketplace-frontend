import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TablePagination, TableRow, Button, CircularProgress, Snackbar, Link, 
  Breadcrumbs, Card, CardContent, Tooltip, Chip
} from '@mui/material';
import { CheckCircle, Cancel } from '@mui/icons-material';
import axios from 'axios';

// Define the columns for the table
const columns = [
  { id: 'user', label: 'Username', minWidth: 170 },
  { id: 'productName', label: 'Product Name', minWidth: 170 },
  { id: 'productCode', label: 'Product Code', minWidth: 100 },
  { id: 'category', label: 'Category', minWidth: 170 },
  { id: 'status', label: 'Approval Status', minWidth: 170 },
];

// Create data function to format the rows
const createData = (productName, user, productCode, category, status) => {
  const formatStatus = (status) => {
    if (status === 'approved') return 'Approved';
    if (status === 'rejected') return 'Rejected';
    if (status === 'Available') return 'Pending';
    return status; // Return the status as is if not recognized
  };

  return { productName, user, productCode, category, status: formatStatus(status) };
};

const ProductApproval = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [summary, setSummary] = useState({ pending: 0, approved: 0, rejected: 0 });

  // Fetch data from an API endpoint
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:8080/api/product/pendingApproval'); // Modify with actual endpoint
        const productData = response.data.map((product) =>
          createData(
            product.productName,
            product.sellerUsername, // Assuming API returns seller username
            product.productCode,
            product.category,
            product.status
          )
        );
        setProducts(productData);
        updateSummary(productData); // Update summary when products are fetched
      } catch (error) {
        setError('Error fetching products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Update the summary counts based on product status
  const updateSummary = (data) => {
    const approved = data.filter(p => p.status === 'Approved').length;
    const rejected = data.filter(p => p.status === 'Rejected').length;
    const pending = data.filter(p => p.status === 'Available').length;
    setSummary({ approved, rejected, pending });
  };

  const handleApprove = async (productCode) => {
    try {
      const response = await axios.post('http://localhost:8080/api/product/approve', { productCode });
      setSuccessMessage('Product approved successfully!');
      
      // Update the products and summary immediately
      setProducts((prevProducts) => {
        const updatedProducts = prevProducts.map(product =>
          product.productCode === productCode
            ? { ...product, status: 'Approved' } // Use "Approved" here
            : product
        );
        updateSummary(updatedProducts); // Update summary after approving
        return updatedProducts;
      });
    } catch (error) {
      setError('Error approving product');
    }
  };
  
  const handleReject = async (productCode) => {
    try {
      const response = await axios.post('http://localhost:8080/api/product/reject', { productCode });
      setSuccessMessage('Product rejected successfully!');
      
      // Update the products and summary immediately
      setProducts((prevProducts) => {
        const updatedProducts = prevProducts.map(product =>
          product.productCode === productCode
            ? { ...product, status: 'Rejected' } // Use "Rejected" here
            : product
        );
        updateSummary(updatedProducts); // Update summary after rejecting
        return updatedProducts;
      });
    } catch (error) {
      setError('Error rejecting product');
    }
  };  

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
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
      case 'Available':
        return {
          ...props,
          sx: {
            ...props.sx,
            bgcolor: '#28a745', // Green color for Available
            '&:hover': { bgcolor: '#28a745' }
          }
        };
      case 'Approved':
        return {
          ...props,
          sx: {
            ...props.sx,
            bgcolor: '#007bff', // Blue color for Approved
            '&:hover': { bgcolor: '#007bff' }
          }
        };
      case 'Rejected':
        return {
          ...props,
          sx: {
            ...props.sx,
            bgcolor: '#dc3545', // Red color for Rejected
            '&:hover': { bgcolor: '#dc3545' }
          }
        };
      default:
        return props;
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link color="inherit" href="/admin/dashboard">
          Dashboard
        </Link>
        <Typography color="textPrimary">Product Approval</Typography>
      </Breadcrumbs>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ color: '#89343b' }}>
          Product Approval
        </Typography>
      </Box>

      {/* Summary Cards */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Card sx={{ minWidth: 200, backgroundColor: '#66bb6a', color: 'white' }}>
          <CardContent>
            <Typography variant="h6">Pending</Typography>
            <Typography variant="h4">{summary.pending}</Typography>
          </CardContent>
        </Card>
        <Card sx={{ minWidth: 200, backgroundColor: '#ef5350', color: 'white' }}>
          <CardContent>
            <Typography variant="h6">Approved</Typography>
            <Typography variant="h4">{summary.approved}</Typography>
          </CardContent>
        </Card>
        <Card sx={{ minWidth: 200, backgroundColor: '#f57c00', color: 'white' }}>
          <CardContent>
            <Typography variant="h6">Rejected</Typography>
            <Typography variant="h4">{summary.rejected}</Typography>
          </CardContent>
        </Card>
      </Box>

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
                      sx={{
                        backgroundColor: '#f4f4f4',
                        fontWeight: 'bold',
                        color: '#555',
                        borderBottom: '2px solid #ddd',
                        minWidth: column.minWidth,
                      }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                  <TableCell key="actions" align="left" sx={{ backgroundColor: '#f4f4f4', borderBottom: '2px solid #ddd' }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => (
                    <TableRow hover role="checkbox" tabIndex={-1} key={index} sx={{ '&:hover': { backgroundColor: '#fafafa' } }}>
                      {columns.map((column) => {
                        const value = row[column.id];

                        // Check if this is the 'status' column and apply getStatusChipProps
                        if (column.id === 'status') {
                          const statusProps = getStatusChipProps(value); // Get props based on the status value
                          return (
                            <TableCell key={column.id} align="left" sx={{ padding: '16px' }}>
                              <Chip {...statusProps} /> {/* Render the Chip component with the props */}
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
                            onClick={() => handleApprove(row.productCode)}
                            sx={{
                              marginRight: 1,
                              padding: '4px 12px',
                              fontSize: '0.875rem',
                              borderRadius: 2,
                              textTransform: 'capitalize',
                              '&:hover': {
                                backgroundColor: '#66bb6a', // A lighter green for hover
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
                            onClick={() => handleReject(row.productCode)}
                            sx={{
                              padding: '4px 12px',
                              fontSize: '0.875rem',
                              borderRadius: 2,
                              textTransform: 'capitalize',
                              '&:hover': {
                                backgroundColor: '#ef5350', // A lighter red for hover
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

      {/* Error Snackbar */}
      <Snackbar
        open={Boolean(error)}
        message={error}
        autoHideDuration={3000}
        onClose={() => setError(null)}
        severity="error"
      />

      {/* Success Snackbar */}
      <Snackbar
        open={Boolean(successMessage)}
        message={successMessage}
        autoHideDuration={3000}
        onClose={() => setSuccessMessage(null)}
        severity="success"
      />
    </Box>
  );
};

export default ProductApproval;
