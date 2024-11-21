import React from "react";
import { 
  Box, 
  List, 
  ListItem, 
  ListItemAvatar, 
  Avatar, 
  ListItemText, 
  Typography, 
  TextField, 
  InputAdornment, 
  IconButton, 
  Menu, 
  MenuItem } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const Sidebar = ({ users, selectedUser, setSelectedUser, viewSellerChats, toggleSellerChats, messages, handleMenuClick, menuAnchor, handleMenuClose }) => (
  <Box width="30%" borderRight="1px solid #ddd" display="flex" flexDirection="column" bgcolor="white">
    {/* Header */}
    <Box display="flex" justifyContent="space-between" alignItems="center" padding="16px" borderBottom="1px solid #ddd">
      <Typography variant="h6" fontWeight="bold" color="#444">
        {viewSellerChats ? "Chat with Sellers" : "Chat with Buyers"}
      </Typography>
      <IconButton onClick={handleMenuClick}>
        <MoreVertIcon />
      </IconButton>
      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuClose}>
        <MenuItem onClick={handleMenuClose}>Mark All as Read</MenuItem>
        <MenuItem onClick={handleMenuClose}>Delete All</MenuItem>
      </Menu>
    </Box>

    {/* Search Bar */}
    <Box padding="16px">
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search"
        size="small"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
      <Box
        onClick={toggleSellerChats}
        sx={{
          mt: 2,
          padding: 2,
          backgroundColor: "white",
          border: "1px solid #ddd",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        <Typography variant="body1" fontWeight="bold">
          {viewSellerChats ? "See Chat with Buyers" : "See Chat with Sellers"}
        </Typography>
        <Typography variant="caption" color="#999">
          {messages.filter((msg) => msg.unread).length} Unread Messages
        </Typography>
      </Box>
    </Box>

    {/* User List */}
    <List>
      {users.map((user) => (
        <ListItem
          key={user.id}
          button
          onClick={() => setSelectedUser(user)}
          selected={selectedUser?.id === user.id}
          sx={{ bgcolor: selectedUser?.id === user.id ? "#f5f5f5" : "transparent" }}
        >
          <ListItemAvatar>
            <Avatar>{user.firstName.charAt(0)}</Avatar>
          </ListItemAvatar>
          <ListItemText
              primary={
                <Typography fontWeight={messages.find((msg) => msg.sender === user.username || msg.recipient === user.username)?.unread ? "bold" : "normal"}>
                  {user.firstName + " " + user.lastName}
                </Typography>
              }
              secondary={
                messages
                  .filter((msg) => msg.sender === user.username || msg.recipient === user.username)
                  .slice(-1)[0]?.text || "No messages yet"
              }
            />
        </ListItem>
      ))}
    </List>
  </Box>
);

export default Sidebar;