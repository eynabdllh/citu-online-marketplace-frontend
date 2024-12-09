import React, { useState } from 'react';
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
import EditUserModal from './EditUserModal';
import AddUserModal from './AddUserModal';

const mockUsers = [
  {
    id: 1,
    username: 'juan_dela_cruz',
    firstName: 'Juan',
    lastName: 'Dela Cruz',
    email: 'juandelacruz@gmail.com',
    status: 'Active',
    role: 'User',
    lastLogin: '2024-03-20 14:30',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=juan'
  },
  {
    id: 2,
    username: 'maria_santos',
    firstName: 'Maria',
    lastName: 'Santos',
    email: 'mariasantos@gmail.com',
    status: 'Inactive',
    role: 'Admin',
    lastLogin: '2024-03-19 09:15',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=maria'
  },
  {
    id: 3,
    username: 'pedro_reyes',
    firstName: 'Pedro',
    lastName: 'Reyes',
    email: 'pedroreyes@gmail.com',
    status: 'Blocked',
    role: 'User',
    lastLogin: '2024-03-18 16:45',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=pedro'
  },
  {
    id: 4,
    username: 'rosa_cruz',
    firstName: 'Rosa',
    lastName: 'Cruz',
    email: 'rosacruz@gmail.com',
    status: 'Active',
    role: 'Admin',
    lastLogin: '2024-03-20 11:20',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rosa'
  },
  {
    id: 5,
    username: 'carlo_garcia',
    firstName: 'Carlo',
    lastName: 'Garcia',
    email: 'carlogarcia@gmail.com',
    status: 'Active',
    role: 'User',
    lastLogin: '2024-03-20 13:10',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=carlo'
  },
  {
    id: 6,
    username: 'elena_ramos',
    firstName: 'Elena',
    lastName: 'Ramos',
    email: 'elenaramos@gmail.com',
    status: 'Active',
    role: 'User',
    lastLogin: '2024-03-17 10:30',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=elena'
  },
  {
    id: 7,
    username: 'miguel_bautista',
    firstName: 'Miguel',
    lastName: 'Bautista',
    email: 'miguelbautista@gmail.com',
    status: 'Inactive',
    role: 'User',
    lastLogin: '2024-03-16 15:45',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=miguel'
  }
];

const UserManagement = () => {
  const [users, setUsers] = useState(mockUsers);
  const [filteredUsers, setFilteredUsers] = useState(mockUsers);
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
  const handleUserAction = (action, user) => {
    switch (action) {
      case 'edit':
        setSelectedUserForEdit(user);
        setEditModalOpen(true);
        break;
      case 'block':
        const newStatus = user.status === 'Blocked' ? 'Active' : 'Blocked';
        const updatedUsers = users.map(u => 
          u.id === user.id ? { ...u, status: newStatus } : u
        );
        setUsers(updatedUsers);
        setFilteredUsers(updatedUsers);
        setToast({
          open: true,
          message: `User ${user.username} has been ${newStatus.toLowerCase()}`,
          severity: 'success'
        });
        break;
      case 'delete':
        const remainingUsers = users.filter(u => u.id !== user.id);
        setUsers(remainingUsers);
        setFilteredUsers(remainingUsers);
        setToast({
          open: true,
          message: `User ${user.username} has been deleted`,
          severity: 'success'
        });
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
  const handleBulkDelete = () => {
    const remainingUsers = users.filter(user => !selectedUsers.includes(user.id));
    setUsers(remainingUsers);
    setFilteredUsers(remainingUsers);
    setSelectedUsers([]);
    setToast({
      open: true,
      message: `${selectedUsers.length} users have been deleted`,
      severity: 'success'
    });
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
      return (isAsc ? -1 : 1) * (a[property] < b[property] ? -1 : 1);
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

          {/* Status Dropdown */}
          <Grid item xs={12} sm={2} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={filters.status}
                onChange={(e) => {
                  const newStatus = e.target.value;
                  setFilters(prev => ({ ...prev, status: newStatus }));
                  
                  let filtered = [...users];
                  if (searchQuery) {
                    filtered = filtered.filter(user =>
                      user.username.toLowerCase().startsWith(searchQuery) ||
                      user.firstName.toLowerCase().startsWith(searchQuery) ||
                      user.lastName.toLowerCase().startsWith(searchQuery) ||
                      user.email.toLowerCase().startsWith(searchQuery)
                    );
                  }
                  // status filter
                  if (newStatus) {
                    filtered = filtered.filter(user => user.status === newStatus);
                  }
                  // role filter
                  if (filters.role) {
                    filtered = filtered.filter(user => user.role === filters.role);
                  }
                  
                  setFilteredUsers(filtered);
                  setPage(0);
                }}
                label="Status"
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
                <MenuItem value="Active">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CheckCircle sx={{ mr: 1, color: '#28a745' }} />
                    <Typography variant="body2" sx={{ color: '#333' }}>Active</Typography>
                  </Box>
                </MenuItem>
                <MenuItem value="Inactive">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AccessTime sx={{ mr: 1, color: '#ff9800' }} />
                    <Typography variant="body2" sx={{ color: '#333' }}>Inactive</Typography>
                  </Box>
                </MenuItem>
                <MenuItem value="Blocked">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Cancel sx={{ mr: 1, color: '#dc3545' }} />
                    <Typography variant="body2" sx={{ color: '#333' }}>Blocked</Typography>
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>
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

          {/* Add User Button */}
          <Grid item xs={12} sm={2} md={2} sx={{ display: 'flex', justifyContent: "right", marginLeft: "auto" }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setAddUserModalOpen(true)}
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
          <Typography variant="subtitle1">Active</Typography>
          <Typography variant="h4">
            {users.filter(user => user.status === 'Active').length}
          </Typography>
        </Card>
        <Card sx={{ p: 2, flex: 1, bgcolor: '#c8e6c9' }}>
          <Typography variant="subtitle1">Inactive</Typography>
          <Typography variant="h4">
            {users.filter(user => user.status === 'Inactive').length}
          </Typography>
        </Card>
        <Card sx={{ p: 2, flex: 1, bgcolor: '#ffcdd2' }}>
          <Typography variant="subtitle1">Blocked</Typography>
          <Typography variant="h4">
            {users.filter(user => user.status === 'Blocked').length}
          </Typography>
        </Card>
      </Box>

      {/* Select action buttons */}
      {selectedUsers.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2, gap: 1 }}>
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
          <Button
            variant="contained"
            startIcon={<BlockIcon sx={{ color: 'white' }} />}
            onClick={handleBulkBlock}
            sx={{ 
              bgcolor: '#ed6c02',
              '&:hover': { bgcolor: '#e65100' },
              '& .MuiButton-startIcon': {
                margin: 0,
                marginRight: '8px',
                display: 'flex',
                alignItems: 'center',
                color: 'white'
              }
            }}
          >
            BLOCK/UNBLOCK SELECTED
          </Button>
        </Box>
      )}

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
              <TableCell>Email</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'lastLogin'}
                  direction={orderBy === 'lastLogin' ? order : 'asc'}
                  onClick={() => handleSort('lastLogin')}
                  sx={{ display: 'flex !important' }}
                >
                  Last Login
                </TableSortLabel>
              </TableCell>
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
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar src={user.avatar} sx={{ width: 30, height: 30 }} />
                      {user.username}
                    </Box>
                  </TableCell>
                  <TableCell>{`${user.firstName} ${user.lastName}`}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip {...getStatusChipProps(user.status)} />
                  </TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.lastLogin}</TableCell>
                  <TableCell>
                    <IconButton onClick={(e) => {   
                      setSelectedUser(user);
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
        <MenuItem onClick={() => handleUserAction('block', selectedUser)}>
          <BlockIcon sx={{ mr: 1 }} /> 
          {selectedUser?.status === 'Blocked' ? 'Unblock User' : 'Block User'}
        </MenuItem>
        <MenuItem 
          onClick={() => handleUserAction('delete', selectedUser)} 
          sx={{ color: 'error.main' }}
        >
          <DeleteIcon sx={{ mr: 1 }} /> Delete User
        </MenuItem>
      </Menu>

      {/* Edit User Modal */}
      <EditUserModal
        open={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedUserForEdit(null);
        }}
        user={selectedUserForEdit}
        onSave={(updatedUser) => {
          const updatedUsers = users.map(u => 
            u.id === updatedUser.id ? updatedUser : u
          );
          setUsers(updatedUsers);
          setFilteredUsers(updatedUsers);
          setToast({
            open: true,
            message: 'User updated successfully',
            severity: 'success'
          });
        }}
      />

      {/*Toast */}
      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        sx={{ 
          position: 'fixed',
          bottom: 16,
          right: 16
        }}
      >
        <Alert 
          severity={toast.severity} 
          sx={{ 
            width: '100%',
            boxShadow: 3
          }}
        >
          {toast.message}
        </Alert>
      </Snackbar>

      {/* Add User Modal */}
      <AddUserModal
        open={addUserModalOpen}
        onClose={() => setAddUserModalOpen(false)}
        onAdd={(newUser) => {
          const updatedUsers = [...users, { ...newUser, id: users.length + 1 }];
          setUsers(updatedUsers);
          setFilteredUsers(updatedUsers);
          setToast({
            open: true,
            message: 'User added successfully',
            severity: 'success'
          });
        }}
      />
    </Box>
  );
};

export default UserManagement;