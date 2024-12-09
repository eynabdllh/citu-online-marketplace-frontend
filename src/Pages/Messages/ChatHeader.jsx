import React from "react";
import { Box, Typography, Avatar, IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const ChatHeader = ({ selectedUser, headerMenuAnchor, handleHeaderMenuClick, handleMenuClose, handleArchiveChat, handleBlockUser, handleViewProfile }) => (
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
      <MenuItem onClick={() => handleArchiveChat(selectedUser.id)}>Archive</MenuItem>
      <MenuItem onClick={() => handleBlockUser(selectedUser.id)}>Block</MenuItem>
      <MenuItem onClick={() => handleViewProfile(selectedUser.username)}>View Profile</MenuItem>
    </Menu>
  </Box>
);

export default ChatHeader;