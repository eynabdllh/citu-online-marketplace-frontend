import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Chip,
  Snackbar,
  Alert,
  Checkbox,
  TableSortLabel,
  Avatar,
  Grid,
  Card,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  MoreVert as MoreVertIcon,
  FileDownload as FileDownloadIcon,
  Block as BlockIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  CheckCircle,
  Cancel,
  AccessTime,
} from '@mui/icons-material';
import * as XLSX from 'xlsx';
import AddUserModal from './AddUserModal';
import UpdateUserModal from './UpdateUserModal';
import axios from 'axios';
import AddAdminModal from './AddAdminModal';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [actionAnchorEl, setActionAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    role: ''
  });
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedUserForEdit, setSelectedUserForEdit] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [orderBy, setOrderBy] = useState('username');
  const [order, setOrder] = useState('asc');
  const [addUserModalOpen, setAddUserModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedUserForUpdate, setSelectedUserForUpdate] = useState(null);
  const [addMenuAnchorEl, setAddMenuAnchorEl] = useState(null);
  const [addAdminModalOpen, setAddAdminModalOpen] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const [adminsResponse, sellersResponse] = await Promise.all([
          axios.get('http://localhost:8080/api/admin/getAllAdmins'),
          axios.get('http://localhost:8080/api/admin/sellers')
        ]);

        const adminsWithRole = adminsResponse.data.map(admin => ({
          ...admin,
          role: 'Admin'
        }));

        const sellersWithRole = sellersResponse.data.map(seller => ({
          ...seller,
          role: 'User'
        }));

        const combinedUsers = [...adminsWithRole, ...sellersWithRole].filter((user, index, self) =>
          index === self.findIndex((t) => t.username === user.username)
        );
        
        setUsers(combinedUsers);
        setFilteredUsers(combinedUsers);
        
      } catch (error) {
        console.error('Error fetching users:', error);
        setToast({
          open: true,
          message: 'Error fetching users. Please try again later.',
          severity: 'error'
        });
      }
    };

    fetchUsers();
  }, []);

  //  search function
  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    
    let filtered = [...users].filter(user => {
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
      const words = fullName.split(' ');
      
      return user.username.toLowerCase().startsWith(query) ||
             user.email.toLowerCase().startsWith(query) ||
             words.some(word => word.startsWith(query));
    });

    if (filters.status) {
      filtered = filtered.filter(user => user.status === filters.status);
    }
    if (filters.role) {
      filtered = filtered.filter(user => user.role === filters.role);
    }

    setFilteredUsers(filtered);
    setPage(0);
  };

  // Handle user actions
  const handleUserAction = async (action, user) => {
    switch (action) {
      case 'edit':
        setSelectedUserForUpdate(user);
        setUpdateModalOpen(true);
        break;
      
      case 'delete':
        try {
          const role = user.role === 'Admin' ? 'admin' : 'seller';
          const apiUrl = `http://localhost:8080/api/admin/deleteUser/${role}/${user.username}`;
          
          console.log('Deleting user:', apiUrl); // Debug log
          
          const response = await axios.delete(apiUrl);
          
          if (response.status === 200) {
            // Refresh the data after successful deletion
            const [adminsResponse, sellersResponse] = await Promise.all([
              axios.get('http://localhost:8080/api/admin/getAllAdmins'),
              axios.get('http://localhost:8080/api/admin/sellers')
            ]);

            const adminsWithRole = adminsResponse.data.map(admin => ({
              ...admin,
              role: 'Admin'
            }));

            const sellersWithRole = sellersResponse.data.map(seller => ({
              ...seller,
              role: 'User'
            }));

            const combinedUsers = [...adminsWithRole, ...sellersWithRole].filter((user, index, self) =>
              index === self.findIndex((t) => t.username === user.username)
            );
            
            setUsers(combinedUsers);
            setFilteredUsers(combinedUsers);
            
            setToast({
              open: true,
              message: `User ${user.username} has been deleted successfully`,
              severity: 'success'
            });
          }
        } catch (error) {
          console.error('Error deleting user:', error);
          setToast({
            open: true,
            message: error.response?.data?.message || 'Failed to delete user. Please try again.',
            severity: 'error'
          });
        }
        break;

      case 'block':
        // We'll implement this with actual API call later
        break;
      
      default:
        setToast({
          open: true,
          message: 'Invalid action',
          severity: 'error'
        });
        break;
    }
    setActionAnchorEl(null);
  };

  // Status chip
  const getStatusChipProps = (status) => {
    const props = {
      label: status === 'Block' ? 'Blocked' : status,
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
      case 'Active':
        return {
          ...props,
          sx: {
            ...props.sx,
            bgcolor: '#2e7d32',
            '&:hover': { bgcolor: '#2e7d32' }
          }
        };
      case 'Inactive':
        return {
          ...props,
          sx: {
            ...props.sx,
            bgcolor: '#ed6c02',
            '&:hover': { bgcolor: '#ed6c02' }
          }
        };
      case 'Blocked':
      case 'Block':
        return {
          ...props,
          sx: {
            ...props.sx,
            bgcolor: '#d32f2f',
            '&:hover': { bgcolor: '#d32f2f' }
          }
        };
      default:
        return props;
    }
  };

  // handles bulk selection
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedUsers(filteredUsers.map(user => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  // handlebulk delete
  const handleBulkDelete = async () => {
    try {
      // Delete each selected user
      await Promise.all(
        selectedUsers.map(async (userId) => {
          const user = users.find(u => u.id === userId);
          if (user) {
            const role = user.role === 'Admin' ? 'admin' : 'seller';
            await axios.delete(`http://localhost:8080/api/admin/deleteUser/${role}/${user.username}`);
          }
        })
      );

      // Refresh the data after successful deletions
      const [adminsResponse, sellersResponse] = await Promise.all([
        axios.get('http://localhost:8080/api/admin/getAllAdmins'),
        axios.get('http://localhost:8080/api/admin/sellers')
      ]);

      const adminsWithRole = adminsResponse.data.map(admin => ({
        ...admin,
        role: 'Admin'
      }));

      const sellersWithRole = sellersResponse.data.map(seller => ({
        ...seller,
        role: 'User'
      }));

      const combinedUsers = [...adminsWithRole, ...sellersWithRole].filter((user, index, self) =>
        index === self.findIndex((t) => t.username === user.username)
      );
      
      setUsers(combinedUsers);
      setFilteredUsers(combinedUsers);
      setSelectedUsers([]);
      
      setToast({
        open: true,
        message: 'Selected users have been deleted successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error in bulk delete:', error);
      setToast({
        open: true,
        message: error.response?.data?.message || 'Failed to delete selected users. Please try again.',
        severity: 'error'
      });
    }
  };

  // Sorting function
  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);

    const sortedUsers = [...filteredUsers].sort((a, b) => {
      if (property === 'name') {
        const nameA = `${a.firstName} ${a.lastName}`;
        const nameB = `${b.firstName} ${b.lastName}`;
        return (isAsc ? -1 : 1) * nameA.localeCompare(nameB);
      }
      // Handle numeric sorting for ID
      if (property === 'id') {
        return (isAsc ? -1 : 1) * (a[property] - b[property]);
      }
      // Default string sorting for other fields
      return (isAsc ? -1 : 1) * (a[property]?.toString().localeCompare(b[property]?.toString()) || 0);
    });

    setFilteredUsers(sortedUsers);
  };

  // handles bulk block
  const handleBulkBlock = () => {
    const updatedUsers = users.map(user => 
      selectedUsers.includes(user.id) 
        ? { ...user, status: user.status === 'Blocked' ? 'Active' : 'Blocked' }
        : user
    );
    setUsers(updatedUsers);
    setFilteredUsers(updatedUsers);
    setSelectedUsers([]);
    setToast({
      open: true,
      message: `Selected users have been ${updatedUsers[0].status === 'Blocked' ? 'blocked' : 'unblocked'}`,
      severity: 'success'
    });
  };

  const handleSaveUser = async (updatedUser) => {
    try {
      // Refresh the data immediately after successful update
      const [adminsResponse, sellersResponse] = await Promise.all([
        axios.get('http://localhost:8080/api/admin/getAllAdmins'),
        axios.get('http://localhost:8080/api/admin/sellers')
      ]);

      const adminsWithRole = adminsResponse.data.map(admin => ({
        ...admin,
        role: 'Admin'
      }));

      const sellersWithRole = sellersResponse.data.map(seller => ({
        ...seller,
        role: 'User'
      }));

      // Remove any duplicates and update state
      const combinedUsers = [...adminsWithRole, ...sellersWithRole].filter((user, index, self) =>
        index === self.findIndex((t) => t.username === user.username)
      );
      
      setUsers(combinedUsers);
      setFilteredUsers(combinedUsers);
      setUpdateModalOpen(false); // Close the modal after successful update
      setSelectedUserForUpdate(null); // Clear the selected user
      
      setToast({
        open: true,
        message: 'User updated successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error refreshing user data:', error);
      setToast({
        open: true,
        message: error.response?.data?.message || 'Error refreshing user data. Please try again.',
        severity: 'error'
      });
    }
  };

  // Add menu handler
  const handleAddClick = (event) => {
    setAddMenuAnchorEl(event.currentTarget);
  };

  const handleAddMenuClose = () => {
    setAddMenuAnchorEl(null);
  };

  const handleAddOptionClick = (type) => {
    handleAddMenuClose();
    if (type === 'user') {
      setAddUserModalOpen(true);
    } else if (type === 'admin') {
      setAddAdminModalOpen(true);
    }
  };

  const handleAddUser = (newUser) => {
    // For sellers (no id needed as username is PK)
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    setFilteredUsers(updatedUsers);
    setToast({
      open: true,
      message: 'User added successfully',
      severity: 'success'
    });
  };

  const handleAddAdmin = async (newAdmin) => {
    try {
      // Fetch fresh data after adding new admin
      const [adminsResponse, sellersResponse] = await Promise.all([
        axios.get('http://localhost:8080/api/admin/getAllAdmins'),
        axios.get('http://localhost:8080/api/admin/sellers')
      ]);

      const adminsWithRole = adminsResponse.data.map(admin => ({
        ...admin,
        role: 'Admin'
      }));

      const sellersWithRole = sellersResponse.data.map(seller => ({
        ...seller,
        role: 'User'
      }));

      const combinedUsers = [...adminsWithRole, ...sellersWithRole].filter((user, index, self) =>
        index === self.findIndex((t) => t.username === user.username)
      );
      
      setUsers(combinedUsers);
      setFilteredUsers(combinedUsers);
      
      setToast({
        open: true,
        message: 'Admin added successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error refreshing data:', error);
      setToast({
        open: true,
        message: 'Admin added but failed to refresh data. Please reload the page.',
        severity: 'warning'
      });
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ color: '#89343b' }}>
          User Management
        </Typography>
      </Box>

      {/* Filter Section */}
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          {/* Search Input */}
          <Grid item xs={12} sm={4} md={4}>
            <TextField
              placeholder="Search users..."
              size="small"
              value={searchQuery}
              onChange={handleSearch}
              sx={{
                width: '100%',
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'white',
                  '& fieldset': { borderColor: 'transparent' },
                  '&:hover fieldset': { borderColor: 'transparent' },
                  '&.Mui-focused fieldset': { borderColor: 'transparent' },
                },
              }}
              InputProps={{
                startAdornment: <SearchIcon sx={{ color: 'action.active', mr: 1 }} />,
              }}
            />
          </Grid>

          {/* Role Dropdown */}
          <Grid item xs={12} sm={2} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Role</InputLabel>
              <Select
                value={filters.role}
                onChange={(e) => {
                  const newRole = e.target.value;
                  setFilters(prev => ({ ...prev, role: newRole }));
                  
                  let filtered = [...users];
       
                  if (searchQuery) {
                    filtered = filtered.filter(user =>
                      user.username.toLowerCase().startsWith(searchQuery) ||
                      user.firstName.toLowerCase().startsWith(searchQuery) ||
                      user.lastName.toLowerCase().startsWith(searchQuery) ||
                      user.email.toLowerCase().startsWith(searchQuery)
                    );
                  }
               
                  if (filters.status) {
                    filtered = filtered.filter(user => user.status === filters.status);
                  }
             
                  if (newRole) {
                    filtered = filtered.filter(user => user.role === newRole);
                  }
                  
                  setFilteredUsers(filtered);
                  setPage(0);
                }}
                label="Role"
                sx={{
                  backgroundColor: '#ffd700',
                  boxShadow: 'none',
                  border: 'none',
                  '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                  '&:hover': {
                    backgroundColor: '#ffcd00',
                    boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)',
                  },
                  '&.Mui-focused': {
                    backgroundColor: '#e0e0e0',
                    boxShadow: 'none',
                  },
                  '& .MuiSelect-icon': { color: '#8A252C' },
                }}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Admin">Admin</MenuItem>
                <MenuItem value="User">User</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Action Buttons */}
          <Grid item xs={12} sm={4} md={4} sx={{ display: 'flex', justifyContent: "right", marginLeft: "auto", gap: 2 }}>
            {selectedUsers.length > 0 && (
              <Button
                variant="contained"
                startIcon={<DeleteIcon sx={{ color: 'white' }} />}
                onClick={handleBulkDelete}
                sx={{ 
                  bgcolor: '#d32f2f',
                  '&:hover': { bgcolor: '#b71c1c' },
                  '& .MuiButton-startIcon': {
                    margin: 0,
                    marginRight: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    color: 'white'
                  }
                }}
              >
                DELETE SELECTED
              </Button>
            )}
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddClick}
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
              Add User
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Summary Cards */}
      <Box sx={{ display: 'flex', gap: 2, my: 2 }}>
        <Card sx={{ p: 2, flex: 1, bgcolor: '#ffefc3' }}>
          <Typography variant="subtitle1">Users</Typography>
          <Typography variant="h4">
            {users.filter(user => user.role === 'User').length}
          </Typography>
        </Card>
        <Card sx={{ p: 2, flex: 1, bgcolor: '#c8e6c9' }}>
          <Typography variant="subtitle1">Admins</Typography>
          <Typography variant="h4">
            {users.filter(user => user.role === 'Admin').length}
          </Typography>
        </Card>
      </Box>

      {/* Table Container */}
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
                  indeterminate={selectedUsers.length > 0 && selectedUsers.length < filteredUsers.length}
                  checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'id'}
                  direction={orderBy === 'id' ? order : 'asc'}
                  onClick={() => handleSort('id')}
                >
                  ID
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'username'}
                  direction={orderBy === 'username' ? order : 'asc'}
                  onClick={() => handleSort('username')}
                >
                  Username
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'name'}
                  direction={orderBy === 'name' ? order : 'asc'}
                  onClick={() => handleSort('name')}
                >
                  Name 
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'email'}
                  direction={orderBy === 'email' ? order : 'asc'}
                  onClick={() => handleSort('email')}
                >
                  Email
                </TableSortLabel>
              </TableCell>
              <TableCell>Contact No</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((user) => (
                <TableRow key={user.id}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedUsers.includes(user.id)}
                      onChange={(e) => {
                        setSelectedUsers(prev => 
                          e.target.checked 
                            ? [...prev, user.id]
                            : prev.filter(id => id !== user.id)
                        );
                      }}
                    />
                  </TableCell>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar
                        src={user.profilePhoto ? `http://localhost:8080/profile-images/${user.profilePhoto}` : `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
                        alt={user.username}
                        sx={{ width: 40, height: 40 }}
                      />
                      {user.username}
                    </Box>
                  </TableCell>
                  <TableCell>{`${user.firstName} ${user.lastName}`}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.contactNo || 'N/A'}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <IconButton 
                      onClick={(e) => {   
                        setSelectedUser(user);
                        setActionAnchorEl(e.currentTarget);
                      }}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        component="div"
        count={filteredUsers.length}
        page={page}
        onPageChange={(e, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
        sx={{
          backgroundColor: '#f4f4f4',
          borderTop: '2px solid #ddd',
          '& .MuiTablePagination-selectIcon': { color: '#555' },
          '& .MuiTablePagination-caption': { color: '#555' },
          '& .MuiTablePagination-toolbar': {
            justifyContent: 'flex-end',
          },
          '& .MuiTablePagination-actions': {
            marginLeft: 0,
          },
        }}
      />

      {/* Action Menu */}
      <Menu
        anchorEl={actionAnchorEl}
        open={Boolean(actionAnchorEl)}
        onClose={() => setActionAnchorEl(null)}
      >
        <MenuItem onClick={() => handleUserAction('edit', selectedUser)}>
          <EditIcon sx={{ mr: 1 }} /> Edit User
        </MenuItem>
        <MenuItem 
          onClick={() => handleUserAction('delete', selectedUser)} 
          sx={{ color: 'error.main' }}
        >
          <DeleteIcon sx={{ mr: 1 }} /> Delete User
        </MenuItem>
      </Menu>

      {/* Update User Modal */}
      <UpdateUserModal
        open={updateModalOpen}
        onClose={() => {
          setUpdateModalOpen(false);
          setSelectedUserForUpdate(null);
        }}
        user={selectedUserForUpdate}
        onSave={handleSaveUser}
      />

      {/*Toast */}
      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        TransitionProps={{ enter: true }}
        sx={{ maxWidth: '100%' }}
      >
        <Alert severity={toast.severity} sx={{ width: '100%' }}>
          {toast.message}
        </Alert>
      </Snackbar>

      {/* Add the menu */}
      <Menu
        anchorEl={addMenuAnchorEl}
        open={Boolean(addMenuAnchorEl)}
        onClose={handleAddMenuClose}
      >
        <MenuItem onClick={() => handleAddOptionClick('user')}>Add User</MenuItem>
        <MenuItem onClick={() => handleAddOptionClick('admin')}>Add Admin</MenuItem>
      </Menu>

      {/* Add both modals */}
      <AddUserModal
        open={addUserModalOpen}
        onClose={() => setAddUserModalOpen(false)}
        onAdd={handleAddUser}
      />

      <AddAdminModal
        open={addAdminModalOpen}
        onClose={() => setAddAdminModalOpen(false)}
        onAdd={handleAddAdmin}
      />
    </Box>
  );
};

export default UserManagement;