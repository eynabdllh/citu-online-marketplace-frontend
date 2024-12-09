import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Grid, 
  Paper, 
  Typography, 
  Card, 
  CardContent,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';
import {
  People as PeopleIcon,
  Inventory as InventoryIcon,
  PendingActions as PendingIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  AccessTime as AccessTimeIcon
} from '@mui/icons-material';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import axios from 'axios';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

// mock data 
const mockData = {
  stats: {
    totalUsers: 7,
    },
  recentlySold: [
    {
      productCode: 'PRD001',
      productName: 'Gaming Laptop',
      sellerUsername: 'juan_dela_cruz',
      buyerUsername: 'maria_santos',
      category: 'Electronics',
      price: 75000,
      soldDate: '2024-03-20',
      imagePath: 'https://picsum.photos/200/300'
    },
    {
      productCode: 'PRD006',
      productName: 'Wireless Mouse',
      sellerUsername: 'pedro_reyes',
      buyerUsername: 'rosa_cruz',
      category: 'Accessories',
      price: 1200,
      soldDate: '2024-03-19',
      imagePath: 'https://picsum.photos/200/305'
    },
    {
      productCode: 'PRD008',
      productName: 'Headphones',
      sellerUsername: 'maria_santos',
      buyerUsername: 'juan_dela_cruz',
      category: 'Electronics',
      price: 3500,
      soldDate: '2024-03-18',
      imagePath: 'https://picsum.photos/200/306'
    },
    {
      productCode: 'PRD002',
      productName: 'Mechanical Keyboard',
      sellerUsername: 'carlo_garcia',
      buyerUsername: 'pedro_reyes',
      category: 'Accessories',
      price: 5500,
      soldDate: '2024-03-17',
      imagePath: 'https://picsum.photos/200/301'
    },
    {
      productCode: 'PRD007',
      productName: 'Gaming Chair',
      sellerUsername: 'rosa_cruz',
      buyerUsername: 'maria_santos',
      category: 'Furniture',
      price: 15000,
      soldDate: '2024-03-16',
      imagePath: 'https://picsum.photos/200/306'
    },
    {
      productCode: 'PRD009',
      productName: 'Gaming Monitor',
      sellerUsername: 'juan_dela_cruz',
      buyerUsername: 'carlo_garcia',
      category: 'Electronics',
      price: 25000,
      soldDate: '2024-03-15',
      imagePath: 'https://picsum.photos/200/308'
    }
  ]
};

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalUsers: 7, 
    },
    recentProducts: [], 
    recentlySold: mockData.recentlySold 
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch pending approvals data
        const approvalsResponse = await axios.get('http://localhost:8080/api/product/pendingApproval');
        const approvals = approvalsResponse.data;

        console.log('Approvals data:', approvals); 

        // Calculate stats
        const totalProducts = approvals.length;
        const approvedProducts = approvals.filter(p => p.status === 'approved').length;
        const pendingApprovals = approvals.filter(p => p.status === 'Available').length;

        // Get most recent products (last 10)
        const recentProducts = approvals
          .slice(0, 10)
          .map(item => ({
            productCode: item.productCode,
            productName: item.productName,
            sellerUsername: item.sellerUsername,
            category: item.category,
            price: item.product?.buyPrice || 0,
            status: item.status === 'approved' ? 'Approved' : 
                   item.status === 'rejected' ? 'Rejected' : 
                   item.status === 'Available' ? 'Pending' : item.status,
            imagePath: item.product?.imagePath ? `http://localhost:8080/${item.product.imagePath}` : null
          }));

        console.log('Mapped recent products:', recentProducts);

        setDashboardData(prev => ({
          ...prev,
          stats: {
            ...prev.stats,
            totalProducts,
            pendingApprovals,
            approvedProducts
          },
          recentProducts
        }));

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  const chartData = {
    labels: ['Approved', 'Pending', 'Rejected'],
    datasets: [{
      data: [
        dashboardData.stats.approvedProducts,
        dashboardData.stats.pendingApprovals,
        dashboardData.stats.totalProducts - (dashboardData.stats.approvedProducts + dashboardData.stats.pendingApprovals)
      ],
      backgroundColor: [
        '#28a745', // Approved - Green
        '#ffd700', // Pending - Gold
        '#dc3545'  // Rejected - Red
      ],
      borderWidth: 0
    }]
  };

  const chartOptions = {
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true
        }
      }
    },
    cutout: '70%'
  };

  return (
    <Box sx={{ padding: 3 }}> 
      <Typography variant="h4" sx={{ color: '#89343b', mb: 3 }}>
        Dashboard
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            sx={{ 
              bgcolor: '#89343b', 
              color: 'white',
              transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                cursor: 'pointer'
              }
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', mr: 2 }}>
                  <PeopleIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4">{dashboardData.stats.totalUsers}</Typography>
                  <Typography>Total Users</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card 
            sx={{ 
              bgcolor: '#ffd700', 
              color: 'black',
              transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                cursor: 'pointer'
              }
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'rgba(0,0,0,0.2)', mr: 2 }}>
                  <InventoryIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4">{dashboardData.stats.totalProducts}</Typography>
                  <Typography>Total Products</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card 
            sx={{ 
              bgcolor: '#28a745', 
              color: 'white',
              transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                cursor: 'pointer'
              }
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', mr: 2 }}>
                  <CheckCircleIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4">{dashboardData.stats.approvedProducts}</Typography>
                  <Typography>Approved Products</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card 
            sx={{ 
              bgcolor: '#dc3545', 
              color: 'white',
              transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                cursor: 'pointer'
              }
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', mr: 2 }}>
                  <PendingIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4">{dashboardData.stats.pendingApprovals}</Typography>
                  <Typography>Pending Approvals</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Product Approval Status Chart */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Product Approval Status
            </Typography>
            <Doughnut data={chartData} options={chartOptions} />
          </Paper>
        </Grid>

        {/* Recent Products Table */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: { md: 'calc(100% - 49px)' } }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Recent Products
            </Typography>
            <TableContainer 
              sx={{ 
                height: '57vh',
                overflowY: 'auto',
                '&::-webkit-scrollbar': {
                  width: '8px'
                },
                '&::-webkit-scrollbar-track': {
                  background: '#f1f1f1'
                },
                '&::-webkit-scrollbar-thumb': {
                  background: '#888',
                  borderRadius: '4px'
                }
              }}
            >
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ bgcolor: 'background.paper' }}>Product</TableCell>
                    <TableCell sx={{ bgcolor: 'background.paper' }}>Seller</TableCell>
                    <TableCell sx={{ bgcolor: 'background.paper' }}>Category</TableCell>
                    <TableCell sx={{ bgcolor: 'background.paper' }}>Price</TableCell>
                    <TableCell sx={{ bgcolor: 'background.paper' }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dashboardData.recentProducts.map((product) => (
                    <TableRow key={product.productCode} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {product.imagePath ? (
                            <Avatar
                              src={product.imagePath}
                              variant="rounded"
                              sx={{ width: 40, height: 40, mr: 2 }}
                            />
                          ) : (
                            <Avatar 
                              variant="rounded"
                              sx={{ 
                                width: 40, 
                                height: 40, 
                                mr: 2,
                                bgcolor: '#f5f5f5'
                              }}
                            >
                              <Typography variant="caption" color="text.secondary">
                                No img
                              </Typography>
                            </Avatar>
                          )}
                          <Typography variant="subtitle2">
                            {product.productName}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{product.sellerUsername}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>₱{product.price ? product.price.toLocaleString() : '0'}</TableCell>
                      <TableCell>
                        <Chip
                          icon={
                            product.status === 'Approved' ? <CheckCircleIcon sx={{ color: 'white', fontSize: '16px' }} /> :
                            product.status === 'Rejected' ? <CancelIcon sx={{ color: 'white', fontSize: '16px' }} /> :
                            <AccessTimeIcon sx={{ color: 'white', fontSize: '16px' }} />
                          }
                          label={product.status}
                          color={
                            product.status === 'Approved' ? 'success' :
                            product.status === 'Rejected' ? 'error' :
                            'warning'
                          }
                          size="small"
                          sx={{
                            '& .MuiChip-label': {
                              color: 'white',
                              fontSize: '12px',
                              marginTop: '17px',
                              fontWeight: 500
                            },
                            bgcolor: 
                              product.status === 'Approved' ? '#28a745' :
                              product.status === 'Rejected' ? '#dc3545' :
                              '#ffa500',
                            '& .MuiChip-icon': {
                              marginLeft: '8px'
                            },
                            height: '24px',
                            minWidth: '90px',
                            borderRadius: '12px',
                            px: 1
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Recently Sold Items */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Recently Sold Items
            </Typography>
            <TableContainer 
              sx={{ 
                maxHeight: 400,
                overflowY: 'auto',
                '&::-webkit-scrollbar': {
                  width: '8px'
                },
                '&::-webkit-scrollbar-track': {
                  background: '#f1f1f1'
                },
                '&::-webkit-scrollbar-thumb': {
                  background: '#888',
                  borderRadius: '4px'
                }
              }}
            >
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ bgcolor: 'background.paper' }}>Product</TableCell>
                    <TableCell sx={{ bgcolor: 'background.paper' }}>Seller</TableCell>
                    <TableCell sx={{ bgcolor: 'background.paper' }}>Buyer</TableCell>
                    <TableCell sx={{ bgcolor: 'background.paper' }}>Category</TableCell>
                    <TableCell sx={{ bgcolor: 'background.paper' }}>Price</TableCell>
                    <TableCell sx={{ bgcolor: 'background.paper' }}>Sold Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dashboardData.recentlySold.map((item) => (
                    <TableRow key={`${item.productCode}-${item.soldDate}`} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar
                            src={item.imagePath}
                            variant="rounded"
                            sx={{ width: 40, height: 40, mr: 2 }}
                          />
                          <Typography variant="subtitle2">
                            {item.productName}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{item.sellerUsername}</TableCell>
                      <TableCell>{item.buyerUsername}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>₱{item.price.toLocaleString()}</TableCell>
                      <TableCell>{new Date(item.soldDate).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;