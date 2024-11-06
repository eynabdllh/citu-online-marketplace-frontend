import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import Register from './component/Register';
import SellPage from './component/SellPage';
import Login from './component/Login';
import MarketplaceHeader from './component/MarketplaceHeader';
import AddProductForm from './component/AddProductForm';
import ViewProduct from './component/ViewProduct';
import UpdateProductForm from './component/UpdateProductForm';
import UserProfile from './component/UserProfile';
import UserAccount from './component/UserAccount';

function App() {
  const location = useLocation(); // Get the current location

  return (
    <div>
      {/* Conditionally render MarketplaceHeader based on the current route */}
      {location.pathname !== '/' && location.pathname !== '/register' && <MarketplaceHeader />}

      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Login />} /> 
        <Route path="/sell" element={<SellPage />} />
        <Route path="/addnewproduct" element={<AddProductForm />} />
        <Route path="/product/:code" element={<ViewProduct />} />
        <Route path="/update/:code" element={<UpdateProductForm />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/account" element={<UserAccount />} />
      </Routes>
    </div>
  );
}

// Wrap your App in Router
const Main = () => (
  <Router>
    <App />
  </Router>
);

export default Main;
