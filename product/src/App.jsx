import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SellPage from './Pages/Sell/SellPage';
import AddProductForm from './Pages/Sell/AddProductForm';
import ViewProduct from './Pages/Sell/ViewProduct';
import UpdateProductForm from './Pages/Sell/UpdateProductForm';
import MarketplaceHeader from './Pages/Sell/MarketplaceHeader';
import './App.css';


const App = () => {
  return (
    <div>
      <MarketplaceHeader />

      <Routes>
        <Route path="" element={<SellPage />} />
        <Route path="/addnewproduct" element={<AddProductForm />} />
        <Route path="/product/:code" element={<ViewProduct />} />
        <Route path="/update/:code" element={<UpdateProductForm />} />
      </Routes>
    </div>
  );
};

export default App;
