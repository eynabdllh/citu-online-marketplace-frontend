import React, { useState } from "react";
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
  MenuItem, 
  Checkbox, 
  Button } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const Sidebar = ({ 
    users, 
    selectedUser, 
    setSelectedUser,
    messages,
    setMessages,
    selectedChats,
    setSelectedChats,
    handleMarkAsRead,
    handleDeleteSelected,
    menuAnchor,
    setMenuAnchor,
    archivedChats,
    blockedUsers,
    showArchived,
    setShowArchived,
    showBlocked,
    setShowBlocked,
    handleUnarchiveChat,
    handleUnblockUser,
    viewSellerChats,
    toggleSellerChats,
    mockMessagesBuyers,
    mockMessagesSellers,
    loggedInUsername
}) => {
    const [showCheckboxes, setShowCheckboxes] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const handleToggleCheckboxes = () => {
        setShowCheckboxes(!showCheckboxes);
        if (showCheckboxes) {
            setSelectedChats([]);
        }
    };

    const filteredUsers = users.filter(user => {
        // First check if user has any undeleted messages
        const hasUndelectedMessages = messages.some(msg => 
            !msg.deleted && 
            (msg.sender === user.username || msg.recipient === user.username)
        );
        
        if (!hasUndelectedMessages) return false;
        
        // Then apply search filter
        if (!searchTerm) return true;
        
        const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
        const searchWords = searchTerm.toLowerCase().split(' ');
        
        return searchWords.every(word => 
            fullName.split(' ').some(namePart => 
                namePart.startsWith(word)
            )
        );
    });

    const handleUserClick = (user) => {
        setSelectedUser(user);
        // messages as marked as read when clicking the user
        setMessages(prev => prev.map(msg => 
            (msg.sender === user.username || msg.recipient === user.username) 
                ? { ...msg, unread: false } 
                : msg
        ));
    };

    return (
        <Box width="30%" borderRight="1px solid #ddd" bgcolor="white">
            <Box display="flex" justifyContent="space-between" alignItems="left" padding="16px" borderBottom="1px solid #ddd">
                {(showArchived || showBlocked) && (
                    <IconButton onClick={() => {
                        setShowArchived(false);
                        setShowBlocked(false);
                    }}>
                        <ArrowBackIcon />
                    </IconButton>
                )}
                <Typography variant="h6" fontWeight="bold" color="#444">
                    {showArchived ? "Archived Chats" : 
                     showBlocked ? "Blocked Users" :
                     viewSellerChats ? "Chat with Sellers" : "Chat with Buyers"}
                </Typography>
                <IconButton onClick={(e) => setMenuAnchor(e.currentTarget)}>
                    <MoreVertIcon />
                </IconButton>
            </Box>

            <Box padding="16px">
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search"
                    size="small"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />

                {!showArchived && !showBlocked && (
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
                            {(viewSellerChats ? mockMessagesBuyers : mockMessagesSellers).filter((msg) => 
                                msg.unread && 
                                !msg.deleted
                            ).length} Unread Messages
                        </Typography>
                    </Box>
                )}

                <Box
                    onClick={handleToggleCheckboxes}
                    sx={{
                        mt: 1,
                        cursor: 'pointer',
                        color: '#666',
                        '&:hover': { color: '#000' }
                    }}
                >
                    <Typography variant="body2">
                        {showCheckboxes ? "Hide selection" : "Select messages"}
                    </Typography>
                </Box>
            </Box>

            <Menu
                anchorEl={menuAnchor}
                open={Boolean(menuAnchor)}
                onClose={() => setMenuAnchor(null)}
            >
                <MenuItem 
                    onClick={handleMarkAsRead}
                    disabled={selectedChats.length === 0}
                >
                    Mark as read
                </MenuItem>
                <MenuItem 
                    onClick={handleDeleteSelected}
                    disabled={selectedChats.length === 0}
                >
                    Delete selected
                </MenuItem>
                <MenuItem onClick={() => {
                    setShowArchived(true);
                    setShowBlocked(false);
                    setMenuAnchor(null);
                }}>See archived chats</MenuItem>
                <MenuItem onClick={() => {
                    setShowBlocked(true);
                    setShowArchived(false);
                    setMenuAnchor(null);
                }}>See blocked users</MenuItem>
            </Menu>

            <List>
                {filteredUsers.map(user => {
                    const isArchived = archivedChats.includes(user.id);
                    const isBlocked = blockedUsers.includes(user.id);
                    
                    if ((showArchived && !isArchived) || (showBlocked && !isBlocked) || 
                        (!showArchived && !showBlocked && (isArchived || isBlocked))) {
                        return null;
                    }

                    const hasUnreadMessages = messages
                        .filter(msg => msg.sender === user.username || msg.recipient === user.username)
                        .some(msg => {
                            const lastMessage = msg.messages[msg.messages.length - 1];
                            // Message is unread only if the last message is from the other person
                            return msg.unread && lastMessage?.sender !== loggedInUsername;
                        });

                    return (
                        <ListItem
                            key={user.id}
                            button
                            onClick={() => showCheckboxes ? null : handleUserClick(user)}
                            selected={selectedUser?.id === user.id}
                            sx={{ bgcolor: selectedUser?.id === user.id ? "#f5f5f5" : "transparent" }}
                        >
                            {showCheckboxes && (
                                <Checkbox
                                    checked={selectedChats.includes(user.id)}
                                    onChange={(e) => {
                                        e.stopPropagation();
                                        setSelectedChats(prev => 
                                            e.target.checked 
                                                ? [...prev, user.id]
                                                : prev.filter(id => id !== user.id)
                                        );
                                    }}
                                />
                            )}
                            <ListItemAvatar>
                                <Avatar>{user.firstName.charAt(0)}</Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={
                                    <Typography
                                        sx={{
                                            fontWeight: hasUnreadMessages ? 'bold' : 'normal'
                                        }}
                                    >
                                        {user.firstName} {user.lastName}
                                    </Typography>
                                }
                                secondary={
                                    <Typography
                                        sx={{
                                            fontWeight: hasUnreadMessages ? 'bold' : 'normal'
                                        }}
                                    >
                                        {messages
                                            .filter(msg => 
                                                !msg.deleted && 
                                                (msg.sender === user.username || msg.recipient === user.username) &&
                                                msg.messages && 
                                                msg.messages.length > 0
                                            )
                                            .map(msg => {
                                                const lastMessage = msg.messages[msg.messages.length - 1];
                                                return lastMessage?.image && !lastMessage?.text 
                                                    ? "Sent an image" 
                                                    : lastMessage?.text || "No messages yet";
                                            })[0] || "No messages yet"}
                                    </Typography>
                                }
                            />
                            {showArchived && (
                                <Button 
                                    size="small" 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleUnarchiveChat(user.id);
                                    }}
                                    sx={{
                                        color: '#89343b',
                                        '&:hover': {
                                            backgroundColor: '#e0e0e0',
                                            color: '#000'
                                        }
                                    }}
                                >
                                    Unarchive
                                </Button>
                            )}
                            {showBlocked && (
                                <Button 
                                    size="small" 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleUnblockUser(user.id);
                                    }}
                                    sx={{
                                      color: '#89343b',
                                        '&:hover': {
                                            backgroundColor: '#e0e0e0',
                                            color: '#000'
                                        }
                                    }}
                                >
                                    Unblock
                                </Button>
                            )}
                        </ListItem>
                    );
                })}
            </List>
        </Box>
    );
};

export default Sidebar;