import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import SellPage from './Pages/Sell/SellPage';
import AddProductForm from './Pages/Sell/AddProductForm';
import ViewProduct from './Pages/Sell/ViewProduct';
import UpdateProductForm from './Pages/Sell/UpdateProductForm';
import MarketplaceHeader from './components/MarketplaceHeader';
import HomePage from './Pages/Homepage/HomePage';
import BuyPage from './Pages/Buy/BuyPage';
import Register from './Pages/LoginRegister/Register';
import Login from './Pages/LoginRegister/Login';
import UserAccount from './Pages/Profile/UserAccount';
import UserProfile from './Pages/Profile/UserProfile';
import Likes from './Pages/Profile/Likes';
import { AuthProvider } from './contexts/AuthContext'; 
import ViewforSeller from './Pages/Sell/ViewforSeller';
import Chat from './Pages/Messages/Chat';
import NotFound from './Pages/NotFound/NotFound';
import './App.css';

const App = () => {
  const location = useLocation();

  return (
    <AuthProvider> 
      <div>
        {location.pathname !== '/' && location.pathname !== '/register' && <MarketplaceHeader />}
        
        <Routes>
          <Route path="/" element={<Login />} /> 
          <Route path="/home" element={<HomePage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/account" element={<UserAccount />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/likes" element={<Likes />} />
          <Route path="/buy" element={<BuyPage />} />
          <Route path="/buy/product/:code" element={<ViewProduct section="Buy" />} />
          <Route path="/sell" element={<SellPage />} />
          <Route path="/addnewproduct" element={<AddProductForm />} />
          <Route path="/product/:code" element={<ViewProduct />} />
          <Route path="sell/product/:code" element={<ViewforSeller />} /> 
          <Route path="/update/:code" element={<UpdateProductForm />} />
          <Route path="/message" element={<Chat />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </AuthProvider>
  );
};

export default App;
