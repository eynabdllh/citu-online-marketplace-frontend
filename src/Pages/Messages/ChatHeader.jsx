import React from "react";
import { Box, Typography, Avatar, IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const ChatHeader = ({ selectedUser, headerMenuAnchor, handleHeaderMenuClick, handleMenuClose }) => (
  <Box display="flex" justifyContent="space-between" alignItems="center" padding="16px" bgcolor="white" borderBottom="1px solid #ddd">
    <Box display="flex" alignItems="center">
      <Avatar sx={{ marginRight: "10px", bgcolor: "#ffb74d" }}>{selectedUser.firstName.charAt(0)}</Avatar>
      <Box>
        <Typography variant="h6" fontWeight="bold" color="#444">
          {selectedUser.firstName} {selectedUser.lastName}
        </Typography>
        <Typography variant="caption" color="#666">
          {selectedUser.location} · {selectedUser.rating}/5 · {selectedUser.numProducts} Products
        </Typography>
      </Box>
    </Box>
    <IconButton onClick={handleHeaderMenuClick}>
      <MoreVertIcon />
    </IconButton>
    <Menu anchorEl={headerMenuAnchor} open={Boolean(headerMenuAnchor)} onClose={handleMenuClose}>
      <MenuItem onClick={handleMenuClose}>Mute Messages</MenuItem>
      <MenuItem onClick={handleMenuClose}>Block</MenuItem>
      <MenuItem onClick={handleMenuClose}>Archive</MenuItem>
      <MenuItem onClick={handleMenuClose}>View Profile</MenuItem>
    </Menu>
  </Box>
);

export default ChatHeader;