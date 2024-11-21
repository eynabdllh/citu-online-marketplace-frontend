import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import ChatHeader from "./ChatHeader";
import ProductDetails from "./ProductDetails";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import ReviewModal from "./ReviewModal";

const Chat = () => {
    const loggedInUsername = sessionStorage.getItem('username');

    const mockUsers = [
        { id: 1, username: "rucas", firstName: "Rucas", lastName: "Royal", rating: 4.5, location: "Lahug, Cebu City", numProducts: 12 },
        { id: 2, username: "leslie", firstName: "Leslie", lastName: "Alexander", rating: 4.9, location: "Mabolo, Cebu City", numProducts: 8 },
    ];

    const mockMessagesBuyers = [
        { id: 1, sender: "rucas", recipient: loggedInUsername, product: { name: "Winter Jacket", price: 1500, image: "https://via.placeholder.com/100", status: "Available", markedAsSoldTo: null }, text: "Is this jacket waterproof?", time: "01:09 AM", unread: true },
        { id: 2, sender: "leslie", recipient: loggedInUsername, product: { name: "Summer Dress", price: 750, image: "https://via.placeholder.com/100", status: "Sold", markedAsSoldTo: loggedInUsername }, text: "Do you have any new dresses?", time: "02:15 PM", unread: false },
    ];

    const mockMessagesSellers = [
        { id: 1, sender: loggedInUsername, recipient: "leslie", product: { name: "Men's Shoes", price: 2000, image: "https://via.placeholder.com/100", status: "Sold", markedAsSoldTo: loggedInUsername }, text: "Is size 10 available?", time: "10:09 AM", unread: true },
        { id: 2, sender: loggedInUsername, recipient: "rucas", product: { name: "College Uniform", price: 500, image: "https://via.placeholder.com/100", status: "Sold", markedAsSoldTo: "rucas" }, text: "Is this available?", time: "10:09 AM", unread: true },
    ];

    const [users, setUsers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [inputMessage, setInputMessage] = useState("");
    const [menuAnchor, setMenuAnchor] = useState(null);
    const [headerMenuAnchor, setHeaderMenuAnchor] = useState(null);
    const [viewSellerChats, setViewSellerChats] = useState(true);
    const [reviewModalOpen, setReviewModalOpen] = useState(false);
    const [productToReview, setProductToReview] = useState(null);

    useEffect(() => {
        setUsers(mockUsers);
        setMessages(viewSellerChats ? mockMessagesSellers : mockMessagesBuyers);
        setSelectedUser(mockUsers[0]);
    }, [viewSellerChats]);

    const handleSendMessage = () => {
      if (!inputMessage.trim()) return;
  
      const newMessage = {
          id: messages.length + 1,
          sender: loggedInUsername, 
          recipient: selectedUser.username, 
          product: getProductDetails(),
          text: inputMessage,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), 
          unread: true,
      };

      setMessages((prev) => [...prev, newMessage]);
      setInputMessage(""); 
  };
  
    const markAsSold = (product) => {
        const updatedMessages = messages.map((msg) =>
            msg.product.name === product.name && msg.recipient === selectedUser.username
                ? { ...msg, product: { ...msg.product, status: "Sold", markedAsSoldTo: selectedUser.username } }
                : msg
        );
        setMessages(updatedMessages);
        alert(`Product "${product.name}" marked as sold.`);
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


    return (
        <div style={{ display: "flex", height: "100vh" }}>
            <Sidebar
                users={users}
                selectedUser={selectedUser}
                setSelectedUser={setSelectedUser}
                viewSellerChats={viewSellerChats}
                toggleSellerChats={() => setViewSellerChats(!viewSellerChats)}
                messages={messages}
                handleMenuClick={(e) => setMenuAnchor(e.currentTarget)}
                menuAnchor={menuAnchor}
                handleMenuClose={() => setMenuAnchor(null)}
            />
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                {selectedUser && (
                    <>
                        <ChatHeader
                            selectedUser={selectedUser}
                            headerMenuAnchor={headerMenuAnchor}
                            handleHeaderMenuClick={(e) => setHeaderMenuAnchor(e.currentTarget)}
                            handleMenuClose={() => setHeaderMenuAnchor(null)}
                        />
                        <ProductDetails
                            product={getProductDetails()}
                            markAsSold={markAsSold}
                            viewSellerChats={viewSellerChats}
                            openReviewModal={openReviewModal}
                            loggedInUsername={loggedInUsername}
                        />
                    </>
                )}
                <ChatMessages messages={messages} selectedUser={selectedUser} />
                <ChatInput inputMessage={inputMessage} setInputMessage={setInputMessage} handleSendMessage={handleSendMessage} />
            </div>
            <ReviewModal open={reviewModalOpen} onClose={closeReviewModal} product={productToReview} />
        </div>
    );
};

export default Chat;