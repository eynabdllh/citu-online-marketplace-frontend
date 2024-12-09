import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import ChatHeader from "./ChatHeader";
import ProductDetails from "./ProductDetails";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import ReviewModal from "./ReviewModal";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Chat = () => {
    const loggedInUsername = sessionStorage.getItem('username');
    const navigate = useNavigate();

    const mockUsers = [
        { id: 1, username: "rucas", firstName: "Rucas", lastName: "Royal", rating: 4.5, location: "Lahug, Cebu City", numProducts: 12 },
        { id: 2, username: "leslie", firstName: "Leslie", lastName: "Alexander", rating: 4.9, location: "Mabolo, Cebu City", numProducts: 8 },
        { id: 3, username: "mike", firstName: "Mike", lastName: "Wilson", rating: 4.7, location: "Banilad, Cebu City", numProducts: 15 },
        { id: 4, username: "sarah", firstName: "Sarah", lastName: "Garcia", rating: 4.8, location: "IT Park, Cebu City", numProducts: 10 },
        { id: 5, username: "james", firstName: "James", lastName: "Cruz", rating: 4.6, location: "Mandaue City", numProducts: 7 },
        { id: 6, username: "maria", firstName: "Maria", lastName: "Santos", rating: 4.4, location: "Talamban, Cebu City", numProducts: 9 },
    ];

    // Helper function to process messages and mark them as read if user was last sender
    const processMessagesReadStatus = (messages, loggedInUsername) => {
        return messages.map(msg => {
            // Get the last message in the conversation
            const lastMessage = msg.messages[msg.messages.length - 1];
            
            // If the last message was sent by logged in user, mark as read
            // Otherwise, keep the original unread status
            return {
                ...msg,
                unread: lastMessage?.sender === loggedInUsername ? false : msg.unread
            };
        });
    };

    const mockMessagesBuyers = processMessagesReadStatus([
        { 
            id: 1, 
            sender: "rucas", 
            recipient: loggedInUsername, 
            product: { name: "CIT PE Uniform", price: 450, image: "https://via.placeholder.com/100", status: "Available", markedAsSoldTo: null }, 
            text: "Naa pa ni available? Size medium unta", 
            time: "01:09 AM", 
            unread: false,
            messages: [
                { sender: "rucas", text: "Naa pa ni available? Size medium unta", time: "01:09 AM" },
                { sender: loggedInUsername, text: "Yes available pa, naay medium", time: "01:10 AM" },
                { sender: "rucas", text: "Asa ta pwede mag meet?", time: "01:11 AM" },
                { sender: loggedInUsername, text: "Sa GLE lang, what time ka free?", time: "01:12 AM" }
            ]
        },
        { 
            id: 2, 
            sender: "leslie", 
            recipient: loggedInUsername, 
            product: { name: "Engineering Calculator", price: 1200, image: "https://via.placeholder.com/100", status: "Sold", markedAsSoldTo: loggedInUsername }, 
            text: "Pwede pa less? Student ra baya ko", 
            time: "02:15 PM", 
            unread: true,
            messages: [
                { sender: "leslie", text: "Pwede pa less? Student ra baya ko", time: "02:15 PM" },
                { sender: loggedInUsername, text: "1000 last price na", time: "02:20 PM" },
                { sender: "leslie", text: "Sige, when ta pwede mag meet?", time: "02:22 PM" },
                { sender: loggedInUsername, text: "Tomorrow 3PM sa CIT main?", time: "02:25 PM" },
                { sender: "leslie", text: "Sige, see you!", time: "02:26 PM" }
            ]
        },
        { 
            id: 3,  
            sender: "mike", 
            recipient: loggedInUsername, 
            product: { name: "Medical Books Bundle", price: 2500, image: "https://via.placeholder.com/100", status: "Available", markedAsSoldTo: null }, 
            text: "Complete set ni siya? Gray's Anatomy included?", 
            time: "11:30 AM", 
            unread: false,
            messages: [
                { sender: "mike", text: "Complete set ni siya? Gray's Anatomy included?", time: "11:30 AM" },
                { sender: loggedInUsername, text: "Yes complete set with Gray's Anatomy", time: "11:35 AM" },
                { sender: "mike", text: "Last price?", time: "11:36 AM" },
                { sender: loggedInUsername, text: "2300 na lang", time: "11:40 AM" }
            ]
        },
        { 
            id: 4, 
            sender: "sarah", 
            recipient: loggedInUsername, 
            product: { name: "Laboratory Coat", price: 350, image: "https://via.placeholder.com/100", status: "Available", markedAsSoldTo: null }, 
            text: "Is this the required thickness for Chem lab?", 
            time: "09:45 AM", 
            unread: false,
            messages: [
                { sender: "sarah", text: "Is this the required thickness for Chem lab?", time: "09:45 AM" },
                { sender: loggedInUsername, text: "Yes, according sa requirements", time: "09:50 AM" },
                { sender: "sarah", text: "Okay, I'll get one. Free delivery?", time: "09:55 AM" },
                { sender: loggedInUsername, text: "Pickup only sa campus", time: "10:00 AM" }
            ]
        }
    ], loggedInUsername);

    const mockMessagesSellers = processMessagesReadStatus([
        { 
            id: 1, 
            sender: loggedInUsername, 
            recipient: "leslie", 
            product: { name: "Nursing Scrub Suit", price: 800, image: "https://via.placeholder.com/100", status: "Sold", markedAsSoldTo: loggedInUsername }, 
            text: "Pwede ra ba installment? 2 gives?", 
            time: "10:09 AM", 
            unread: false,
            messages: [
                { sender: loggedInUsername, text: "Pwede ra ba installment? 2 gives?", time: "10:09 AM" },
                { sender: "leslie", text: "Di pwede installment kay need nako cash", time: "10:15 AM" },
                { sender: loggedInUsername, text: "Ah sige, thanks anyway!", time: "10:20 AM" },
                { sender: "leslie", text: "Welcome!", time: "10:25 AM" }
            ]
        },
        { 
            id: 2, 
            sender: loggedInUsername, 
            recipient: "rucas", 
            product: { name: "College Department Shirt", price: 200, image: "https://via.placeholder.com/100", status: "Sold", markedAsSoldTo: "rucas" }, 
            text: "Asa ka dapit sa CIT? Can meetup today?", 
            time: "10:09 AM", 
            unread: false,
            messages: [
                { sender: loggedInUsername, text: "Hello! Available pa ni?", time: "10:00 AM" },
                { sender: "rucas", text: "Yes available pa", time: "10:05 AM" },
                { sender: loggedInUsername, text: "Asa ka dapit sa CIT? Can meetup today?", time: "10:09 AM" },
                { sender: "rucas", text: "Sa NGE ko karon", time: "10:15 AM" }
            ]
        },
        { 
            id: 3, 
            sender: loggedInUsername, 
            recipient: "james", 
            product: { name: "Architecture Drawing Set", price: 1500, image: "https://via.placeholder.com/100", status: "Available", markedAsSoldTo: null }, 
            text: "Complete set ni with drafting table?", 
            time: "03:20 PM", 
            unread: true,
            messages: [
                { sender: loggedInUsername, text: "Complete set ni with drafting table?", time: "03:20 PM" },
                { sender: "james", text: "Yes complete set", time: "03:25 PM" },
                { sender: loggedInUsername, text: "Last price?", time: "03:30 PM" },
                { sender: "james", text: "1400 na lang", time: "03:35 PM" }
            ]
        },
        { 
            id: 4, 
            sender: loggedInUsername, 
            recipient: "maria", 
            product: { name: "Accounting Books Y1", price: 1800, image: "https://via.placeholder.com/100", status: "Available", markedAsSoldTo: null }, 
            text: "Naa kay picture sa condition sa books?", 
            time: "05:15 PM", 
            unread: true,
            messages: [
                { sender: loggedInUsername, text: "Naa kay picture sa condition sa books?", time: "05:15 PM" },
                { sender: "maria", text: "Yes, wait lang", time: "05:20 PM" },
                { sender: loggedInUsername, text: "Okay, thanks!", time: "05:25 PM" },
                { sender: "maria", text: "Here's the condition of the books", time: "05:30 PM", image: "accounting-books.jpg" }
            ]
        }
    ], loggedInUsername);

    const [users, setUsers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [inputMessage, setInputMessage] = useState("");
    const [menuAnchor, setMenuAnchor] = useState(null);
    const [headerMenuAnchor, setHeaderMenuAnchor] = useState(null);
    const [viewSellerChats, setViewSellerChats] = useState(true);
    const [reviewModalOpen, setReviewModalOpen] = useState(false);
    const [productToReview, setProductToReview] = useState(null);
    const [selectedChats, setSelectedChats] = useState([]);
    const [archivedChats, setArchivedChats] = useState([]);
    const [blockedUsers, setBlockedUsers] = useState([]);
    const [hasReviewed, setHasReviewed] = useState(false);
    const [showArchived, setShowArchived] = useState(false);
    const [showBlocked, setShowBlocked] = useState(false);
    const [mockBuyerMessages, setMockBuyerMessages] = useState(mockMessagesBuyers);
    const [mockSellerMessages, setMockSellerMessages] = useState(mockMessagesSellers);

    useEffect(() => {
        setUsers(mockUsers);
        setMessages(viewSellerChats ? mockSellerMessages : mockBuyerMessages);
        setSelectedUser(mockUsers[0]);
    }, [viewSellerChats, mockBuyerMessages, mockSellerMessages]);

    const handleSendMessage = () => {
        if (!inputMessage.trim() || !selectedUser) return;

        const newMessage = {
            sender: loggedInUsername,
            text: inputMessage,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setMessages(prevMessages => {
            const existingConversation = prevMessages.find(
                msg => msg.sender === selectedUser.username || msg.recipient === selectedUser.username
            );

            if (existingConversation) {
                // Update existing conversation
                return prevMessages.map(msg =>
                    (msg.sender === selectedUser.username || msg.recipient === selectedUser.username)
                        ? {
                            ...msg,
                            messages: [...(msg.messages || []), newMessage],
                            text: newMessage.text, // Update the preview text
                            time: newMessage.time // Update the time
                        }
                        : msg
                );
            } else {
                // Create new conversation
                const newConversation = {
                    id: Date.now(),
                    sender: loggedInUsername,
                    recipient: selectedUser.username,
                    messages: [newMessage],
                    text: newMessage.text,
                    time: newMessage.time,
                    unread: false
                };
                return [...prevMessages, newConversation];
            }
        });

        setInputMessage("");
    };

    const markAsSold = (product) => {
        const updatedMessages = messages.map(msg =>
            msg.product.name === product.name
                ? { ...msg, product: { ...msg.product, status: 'Sold' } }
                : msg
        );
        setMessages(updatedMessages);
        toast.success(`${product.name} marked as sold`);
    };

    const openReviewModal = (product) => {
        setProductToReview(product);
        setReviewModalOpen(true);
    };

    const closeReviewModal = () => {
        setReviewModalOpen(false);
        setProductToReview(null);
    };

    const getProductDetails = () => {
        return messages.find((msg) =>
            viewSellerChats
                ? msg.sender === selectedUser.username || msg.recipient === selectedUser.username
                : msg.recipient === loggedInUsername && msg.sender === selectedUser.username
        )?.product;
    };

    const handleMarkAsRead = () => {
        if (selectedChats.length === 0) {
            toast.error('Please select messages to mark as read');
            return;
        }

        if (viewSellerChats) {
            // Update only seller messages
            const updatedSellerMessages = mockSellerMessages.map(msg => {
                const userSelected = selectedChats.some(id => {
                    const user = users.find(u => u.id === id);
                    return user && (msg.sender === user.username || msg.recipient === user.username);
                });
                return userSelected ? { ...msg, unread: false } : msg;
            });
            setMockSellerMessages(updatedSellerMessages);
            setMessages(updatedSellerMessages);
        } else {
            // Update only buyer messages
            const updatedBuyerMessages = mockBuyerMessages.map(msg => {
                const userSelected = selectedChats.some(id => {
                    const user = users.find(u => u.id === id);
                    return user && (msg.sender === user.username || msg.recipient === user.username);
                });
                return userSelected ? { ...msg, unread: false } : msg;
            });
            setMockBuyerMessages(updatedBuyerMessages);
            setMessages(updatedBuyerMessages);
        }

        toast.success('Messages marked as read');
        setSelectedChats([]);
        setMenuAnchor(null);
    };

    const handleDeleteSelected = () => {
        if (selectedChats.length === 0) {
            toast.error('Please select messages to delete');
            return;
        }

        if (viewSellerChats) {
            // Delete only from seller messages
            const updatedSellerMessages = mockSellerMessages.filter(msg => {
                const userSelected = selectedChats.some(id => {
                    const user = users.find(u => u.id === id);
                    return user && (msg.sender === user.username || msg.recipient === user.username);
                });
                return !userSelected;
            });
            setMockSellerMessages(updatedSellerMessages);
            setMessages(updatedSellerMessages);
        } else {
            // Delete only from buyer messages
            const updatedBuyerMessages = mockBuyerMessages.filter(msg => {
                const userSelected = selectedChats.some(id => {
                    const user = users.find(u => u.id === id);
                    return user && (msg.sender === user.username || msg.recipient === user.username);
                });
                return !userSelected;
            });
            setMockBuyerMessages(updatedBuyerMessages);
            setMessages(updatedBuyerMessages);
        }

        // Clear selected user if their chat was deleted
        if (selectedUser && selectedChats.includes(selectedUser.id)) {
            setSelectedUser(null);
        }

        toast.success('Selected messages deleted');
        setSelectedChats([]);
        setMenuAnchor(null);
    };

    const handleArchiveChat = (userId) => {
        setArchivedChats(prev => [...prev, userId]);
        toast.success('Chat archived');
        setHeaderMenuAnchor(null);
    };

    const handleBlockUser = (userId) => {
        setBlockedUsers(prev => [...prev, userId]);
        toast.success('User blocked');
        setHeaderMenuAnchor(null);
    };

    const handleUnarchiveChat = (userId) => {
        setArchivedChats(prev => prev.filter(id => id !== userId));
        toast.success('Chat unarchived');
    };

    const handleUnblockUser = (userId) => {
        setBlockedUsers(prev => prev.filter(id => id !== userId));
        toast.success('User unblocked');
    };

    const handleViewProfile = (username) => {
        navigate(`/profile/${username}`);
        setHeaderMenuAnchor(null);
    };

    const handleSubmitReview = (reviewData) => {
        setHasReviewed(true);
        toast.success('Review submitted successfully');
        closeReviewModal();
    };

    const handleImageUpload = (file) => {
        if (!file || !selectedUser) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            const newMessage = {
                sender: loggedInUsername,
                text: "",
                image: reader.result,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };

            setMessages(prevMessages => {
                const existingConversation = prevMessages.find(
                    msg => msg.sender === selectedUser.username || msg.recipient === selectedUser.username
                );

                if (existingConversation) {
                    return prevMessages.map(msg =>
                        (msg.sender === selectedUser.username || msg.recipient === selectedUser.username)
                            ? {
                                ...msg,
                                messages: [...(msg.messages || []), newMessage],
                                text: "Sent an image",
                                time: newMessage.time
                            }
                            : msg
                    );
                } else {
                    const newConversation = {
                        id: Date.now(),
                        sender: loggedInUsername,
                        recipient: selectedUser.username,
                        messages: [newMessage],
                        text: "Sent an image",
                        time: newMessage.time,
                        unread: false
                    };
                    return [...prevMessages, newConversation];
                }
            });
        };
        reader.readAsDataURL(file);
    };

    return (
        <div style={{ display: "flex", height: "100vh" }}>
            <Sidebar
                users={users}
                selectedUser={selectedUser}
                setSelectedUser={setSelectedUser}
                messages={messages}
                setMessages={setMessages}
                viewSellerChats={viewSellerChats}
                toggleSellerChats={() => setViewSellerChats(!viewSellerChats)}
                selectedChats={selectedChats}
                setSelectedChats={setSelectedChats}
                handleMarkAsRead={handleMarkAsRead}
                handleDeleteSelected={handleDeleteSelected}
                menuAnchor={menuAnchor}
                setMenuAnchor={setMenuAnchor}
                archivedChats={archivedChats}
                blockedUsers={blockedUsers}
                showArchived={showArchived}
                setShowArchived={setShowArchived}
                showBlocked={showBlocked}
                setShowBlocked={setShowBlocked}
                handleUnarchiveChat={handleUnarchiveChat}
                handleUnblockUser={handleUnblockUser}
                mockMessagesBuyers={mockBuyerMessages}
                mockMessagesSellers={mockSellerMessages}
            />
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                {selectedUser && (
                    <>
                        <ChatHeader
                            selectedUser={selectedUser}
                            headerMenuAnchor={headerMenuAnchor}
                            handleHeaderMenuClick={(e) => setHeaderMenuAnchor(e.currentTarget)}
                            handleMenuClose={() => setHeaderMenuAnchor(null)}
                            handleArchiveChat={handleArchiveChat}
                            handleBlockUser={handleBlockUser}
                            handleViewProfile={handleViewProfile}
                        />
                        <ProductDetails
                            product={getProductDetails()}
                            markAsSold={markAsSold}
                            viewSellerChats={viewSellerChats}
                            openReviewModal={openReviewModal}
                            loggedInUsername={loggedInUsername}
                            hasReviewed={hasReviewed}
                        />
                    </>
                )}
                <ChatMessages messages={messages} selectedUser={selectedUser} />
                <ChatInput inputMessage={inputMessage} setInputMessage={setInputMessage} handleSendMessage={handleSendMessage} handleImageUpload={handleImageUpload} />
            </div>
            <ReviewModal open={reviewModalOpen} onClose={closeReviewModal} product={productToReview} onSubmit={handleSubmitReview} />
        </div>
    );
};

export default Chat;