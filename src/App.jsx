import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom';
import SellPage from './Pages/Sell/SellPage';
import AddProductForm from './Pages/Sell/AddProductForm';
import ViewProduct from './Pages/Sell/ViewProduct';
import UpdateProductForm from './Pages/Sell/UpdateProductForm';
import MarketplaceHeader from './components/MarketplaceHeader';
import HomePage from './Pages/Homepage/HomePage';
import BuyPage from './Pages/Buy/BuyPage';
import Register from './Pages/LoginRegister/Register';
import Login from './Pages/LoginRegister/Login';
import AdminLogin from './Pages/LoginRegister/AdminLogin';
import Settings from './Pages/Profile/UserAccount';
import Profile from './Pages/Profile/UserProfile';
import Likes from './Pages/Profile/Likes';
import { AuthProvider } from './contexts/AuthContext'; 
import ViewforSeller from './Pages/Sell/ViewforSeller';
import Message from './Pages/Messages/Chat';
import UserManagement from './Pages/Admin/UserManagement/UserManagement';
import NotFound from './Pages/NotFound/NotFound';
import AdminHeader from './components/AdminHeader';
import Dashboard from './Pages/Admin/Dashboard';
import ProductManagement from './Pages/Admin/ProductManagement/ProductManagement';
import ProductApproval from './Pages/Admin/ProductApproval/ProductApproval';
import AdminSettings from './Pages/Admin/AdminSettings';
import AdminNotifications from './Pages/Admin/AdminNotifications';
import UserNotifications from './Pages/Notifications/UserNotifications';
import { Toaster } from 'react-hot-toast';

import './App.css';

const ProtectedAdminRoute = ({ children }) => {
  const userRole = sessionStorage.getItem('role');
  const navigate = useNavigate();
  
  React.useEffect(() => {
    if (userRole !== 'ADMIN') {
      navigate('/');
    }
  }, [userRole, navigate]);

  if (userRole !== 'ADMIN') {
    return null;
  }

  return children;
};

const ProtectedUserRoute = ({ children }) => {
  const userRole = sessionStorage.getItem('role');
  const navigate = useNavigate();
  
  React.useEffect(() => {
    if (!userRole || userRole === 'ADMIN') {
      navigate('/');
      return;
    }
  }, [userRole, navigate]);

  return userRole && userRole !== 'ADMIN' ? children : null;
};

const App = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin') && location.pathname !== '/admin';

  return (
    <>
      <Toaster />
      <AuthProvider>
        <div>
          {!location.pathname.startsWith('/admin') && 
           location.pathname !== '/' && 
           location.pathname !== '/register' && 
           location.pathname !== '/admin' &&
           <MarketplaceHeader />}
          
          {isAdminRoute && <AdminHeader />}
          
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={<AdminLogin />} />

            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={
              <ProtectedAdminRoute>
                <Dashboard />
              </ProtectedAdminRoute>
            } />
            <Route path="/admin/users" element={
              <ProtectedAdminRoute>
                <UserManagement />
              </ProtectedAdminRoute>
            } />
            <Route path="/admin/productsellers" element={
              <ProtectedAdminRoute>
                <ProductManagement />
              </ProtectedAdminRoute>
            } />
            <Route path="/admin/approvals" element={
              <ProtectedAdminRoute>
                <ProductApproval />
              </ProtectedAdminRoute>
            } />
            <Route path="/admin/settings" element={
              <ProtectedAdminRoute>
                <AdminSettings />
              </ProtectedAdminRoute>
            } />
            <Route path="/admin/notifications" element={
              <ProtectedAdminRoute>
                <AdminNotifications />
              </ProtectedAdminRoute>
            } />

            {/* Protected User Routes */}
            <Route path="/home" element={<ProtectedUserRoute><HomePage /></ProtectedUserRoute>} />
            <Route path="/buy" element={<ProtectedUserRoute><BuyPage /></ProtectedUserRoute>} />
            <Route path="/sell" element={<ProtectedUserRoute><SellPage /></ProtectedUserRoute>} />
            <Route path="/profile" element={<ProtectedUserRoute><Profile /></ProtectedUserRoute>} />
            <Route path="/likes" element={<ProtectedUserRoute><Likes /></ProtectedUserRoute>} />
            <Route path="/account" element={<ProtectedUserRoute><Settings /></ProtectedUserRoute>} />
            <Route path="/message" element={<ProtectedUserRoute><Message /></ProtectedUserRoute>} />
            <Route path="/notifications" element={<ProtectedUserRoute><UserNotifications /></ProtectedUserRoute>} />
            <Route path="/buy/product/:code" element={<ViewProduct section="Buy" />} />
            <Route path="/addnewproduct" element={<AddProductForm />} />
            <Route path="/product/:code" element={<ViewProduct />} />
            <Route path="sell/product/:code" element={<ViewforSeller />} /> 
            <Route path="/update/:code" element={<UpdateProductForm />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </AuthProvider>
    </>
  );
};

export default App;
