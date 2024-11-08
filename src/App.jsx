import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SellPage from './Pages/Sell/SellPage';
import AddProductForm from './Pages/Sell/AddProductForm';
import ViewProduct from './Pages/Sell/ViewProduct';
import UpdateProductForm from './Pages/Sell/UpdateProductForm';
import MarketplaceHeader from './Pages/Sell/MarketplaceHeader';
import HomePage from './Pages/Sell/HomePage';
import BuyPage from './Pages/Sell/BuyPage';
import './App.css';

const App = () => {
  return (
    <div>
      <MarketplaceHeader />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/buy" element={<BuyPage />} />
        <Route path="/sell" element={<SellPage />} />
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
