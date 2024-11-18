import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import ChatHeader from "./ChatHeader";
import ProductDetails from "./ProductDetails";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";

const Chat = () => {
    const mockUsers = [
        { id: 1, username: "rucas", firstName: "Rucas", lastName: "Royal", rating: 4.5, location: "Lahug, Cebu City", numProducts: 12 },
        { id: 2, username: "leslie", firstName: "Leslie", lastName: "Alexander", rating: 4.9, location: "Mabolo, Cebu City", numProducts: 8 },
        { id: 3, username: "floyd", firstName: "Floyd", lastName: "Miles", rating: 4.7, location: "Talamban, Cebu City", numProducts: 10 },
    ];

    const mockMessagesBuyers= [
        { id: 1, sender: "rucas", recipient: "you", product: { name: "Winter Jacket", price: 1500, image: "https://via.placeholder.com/100", status: "Available" }, text: "Is this jacket waterproof?", time: "01:09 AM", unread: true },
        { id: 2, sender: "leslie", recipient: "you", product: { name: "Summer Dress", price: 750, image: "https://via.placeholder.com/100", status: "Sold" }, text: "Do you have any new dresses?", time: "02:15 PM", unread: false },
    ];

    const mockMessagesSellers = [
        { id: 1, sender: "you", recipient: "leslie", product: { name: "Men's Shoes", price: 2000, image: "https://via.placeholder.com/100", status: "Available" }, text: "Is size 10 available?", time: "10:09 AM", unread: true },
        { id: 2, sender: "you", recipient: "rucas", product: { name: "Office Chair", price: 3000, image: "https://via.placeholder.com/100", status: "Available" }, text: "Can this be delivered tomorrow?", time: "12:15 PM", unread: true },
    ];

    const [users, setUsers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [inputMessage, setInputMessage] = useState("");
    const [menuAnchor, setMenuAnchor] = useState(null);
    const [headerMenuAnchor, setHeaderMenuAnchor] = useState(null);
    const [viewSellerChats, setViewSellerChats] = useState(true);

    useEffect(() => {
        setUsers(mockUsers);
        setMessages(viewSellerChats ? mockMessagesSellers : mockMessagesBuyers);
        setSelectedUser(mockUsers[0]);
    }, [viewSellerChats]);

    const handleSendMessage = () => {
        if (!inputMessage.trim()) return;
     
        const newMessage = {
          id: messages.length + 1,
          sender: "you",
          recipient: selectedUser.username,
          product: { name: "New Product", price: 1000, status: "Available" },
          text: inputMessage,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          unread: false,
        };
     
        setMessages((prev) => [...prev, newMessage]);
        setInputMessage("");
      };

    const markAsSold = (product) => {
        alert(`Product "${product.name}" marked as sold.`);
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
              product={messages.find((msg) => msg.sender === selectedUser.username)?.product}
              markAsSold={markAsSold}
              viewSellerChats={viewSellerChats}
            />
          </>
        )}
        <ChatMessages messages={messages} selectedUser={selectedUser} />
        <ChatInput
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          handleSendMessage={handleSendMessage}
        />
      </div>
    </div>
  );
};

export default Chat;