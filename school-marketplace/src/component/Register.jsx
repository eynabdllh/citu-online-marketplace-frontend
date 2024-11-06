import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../assets/static/Register.css'; 
import logo from '../assets/img/logocit-1.png'
import cit from '../assets/img/cit-1.jpg'

const Register = () => {
    const [sellers, setSellers] = useState([]); // To hold all seller records
    const [newSeller, setNewSeller] = useState({ username: '', password: '', firstName: '', lastName: '', address: '', contactNo: '', email: ''});
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

  // Create a new seller
  const createSeller = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {
      console.log(newSeller); // Check if the form data is being populated correctly
      const response = await axios.post('http://localhost:8080/api/seller/postSellerRecord', newSeller);

      setSellers([...sellers,response.data]);
      setNewSeller({ firstName: '', lastName: '', address: '', contactNo: '', email: '', username: '', password: '' }); // Clear form
      setErrorMessage('');
      navigate('/login');
    } catch (error) {
      if(error.response && error.response.status === 409) {
        setErrorMessage('An error occured while creating an account. Please try to refresh.');
      } else {
        setErrorMessage('Username already exists. Please enter another username.');
      }
      console.error('Error creating seller:', error);
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
            <button type="submit">Register</button>
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

