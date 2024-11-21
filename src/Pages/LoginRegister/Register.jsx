import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../../assets/static/Register.css';
import cit from '../../assets/img/cit-1.jpg';
import logo from '../../assets/img/logocit-1.png';

const Register = () => {
    const [sellers, setSellers] = useState([]); 
    const [newSeller, setNewSeller] = useState({ username: '', password: '', firstName: '', lastName: '', address: '', contactNo: '', email: ''});
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

  // Create a new seller
  const createSeller = async (e) => {
    e.preventDefault(); 
    setIsLoading(true);

    if (!newSeller.username || !newSeller.password || !newSeller.firstName || !newSeller.lastName || !newSeller.address || !newSeller.contactNo || !newSeller.email) {
      setErrorMessage('All fields are required. Please fill out the entire form.');
      setIsLoading(false);
      return;
    }

    if (newSeller.password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      setIsLoading(false);
      return;
    }

    if(newSeller.contactNo.length < 11) {
      setErrorMessage('Please enter a valid phone number.');
      setIsLoading(false);
      return;
    }

    try {
      console.log(newSeller); 
      const response = await axios.post('http://localhost:8080/api/seller/postSellerRecord', newSeller);

      setSellers([...sellers,response.data]);
      setNewSeller({ firstName: '', lastName: '', address: '', contactNo: '', email: '', username: '', password: '' }); // Clear form
      setErrorMessage('');
      navigate('/');
    } catch (error) {
      if (error.response) {
        const serverMessage = error.response.data.message;
        
        if (error.response.status === 409 && serverMessage === 'Email already exists') {
          setErrorMessage('This email is already registered. Please use another email.');
        } else if (error.response.status === 409) {
          setErrorMessage(serverMessage);
        } else {
          setErrorMessage('An unexpected error occurred. Please try again later.');
        }
      } else {
        setErrorMessage('An unexpected error occurred. Please try again later.');
      }
        console.error('Error creating seller:', error);
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <div className="register-container">
      <div className="form-container">
        <img src={logo} alt="Logo" className="logo" /> 
        <h2>Welcome to CIT-U Marketplace</h2>
        <span>Create your account</span>

        <form onSubmit={createSeller}>
          {errorMessage && 
            <div className="error-message">{errorMessage}</div>
          }

        <div className="form-group">
            <input 
            type="text" 
            name="username" 
            placeholder='Username'
            value={newSeller.username}
            onChange={(e) => setNewSeller({ ...newSeller, username: e.target.value })}
            />
          </div>
          <div className="form-group">
            <input 
            type="text" 
            name="firstName" 
            placeholder='First name'
            value={newSeller.firstName}
            onChange={(e) => setNewSeller({ ...newSeller, firstName: e.target.value})}
            />
          </div>
          <div className="form-group">
            <input 
            type="text" 
            name="lastName" 
            placeholder='Last name'
            value={newSeller.lastName}
            onChange={(e) => setNewSeller({ ...newSeller, lastName: e.target.value})}
            />
          </div>
          <div className="form-group">
            <input 
            type="text" 
            name="address" 
            placeholder='Address'
            value={newSeller.address}
            onChange={(e) => setNewSeller({ ...newSeller, address: e.target.value})}
            />
          </div>
          <div className="form-group">
            <input 
            type="text" 
            name="contactNo" 
            placeholder='Contact No'
            value={newSeller.contactNo}
            onChange={(e) => setNewSeller({ ...newSeller, contactNo: e.target.value})}
            />
          </div>
          <div className="form-group">
            <input 
            type="email" 
            name="email" 
            placeholder='Email'
            value={newSeller.email}
            onChange={(e) => setNewSeller({ ...newSeller, email: e.target.value})}
            />
          </div>
          <div className="form-group">
            <input 
            type="password" 
            name="password" 
            placeholder='Password'
            value={newSeller.password}
            onChange={(e) => setNewSeller({ ...newSeller, password: e.target.value})}
            />
          </div>
          <div className="button-container">
            <button type="submit" disabled={isLoading}>{isLoading ? 'Registering...' : 'Register'}</button>
            <p className="login-text">Already have an account?  <Link to="/">Login</Link></p>
          </div>
        </form>
      </div>
      <div className="image-container">
        <img src={cit} alt="Registration" className="registration-image" /> 
      </div>
    </div>
  );
};

export default Register;