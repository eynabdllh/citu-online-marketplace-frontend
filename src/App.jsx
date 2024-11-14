import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import SellPage from './Pages/Sell/SellPage';
import AddProductForm from './Pages/Sell/AddProductForm';
import ViewProduct from './Pages/Sell/ViewProduct';
import UpdateProductForm from './Pages/Sell/UpdateProductForm';
import MarketplaceHeader from './Pages/Sell/MarketplaceHeader';
import HomePage from './Pages/Sell/HomePage';
import BuyPage from './Pages/Sell/BuyPage';
import Register from './Pages/Sell/Register';
import Login from './Pages/Sell/Login';
import UserAccount from './Pages/Sell/UserAccount';
import UserProfile from './Pages/Sell/UserProfile';
import './App.css';

const App = () => {
  const location = useLocation();

  return (
    <div>
       {/* Conditionally render MarketplaceHeader based on the current route */}
      {location.pathname !== '/' && location.pathname !== '/register' && <MarketplaceHeader />}

      <Routes>
      <Route path="/" element={<Login />} /> 
        <Route path="/home" element={<HomePage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/account" element={<UserAccount />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/buy" element={<BuyPage />} />
        <Route path="/buy/product/:code" element={<ViewProduct section="Buy" />} />
        <Route path="/sell" element={<SellPage />} />
        <Route path="/sell/product/:code" element={<ViewProduct section="Sell" />} />
        <Route path="/addnewproduct" element={<AddProductForm />} />
        <Route path="/product/:code" element={<ViewProduct />} />
        <Route path="/update/:code" element={<UpdateProductForm />} />
        {/* Additional Routes for New Pages */}
        {/* <Route path="/message" element={<MessagePage />} />
        <Route path="/feedback" element={<FeedbackPage />} /> */}
      </Routes>
    </div>
  );
};

export default App;
