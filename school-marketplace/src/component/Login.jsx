import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../assets/static/Login.css'; 
import logo from '../assets/img/logocit-1.png'
import cit from '../assets/img/cit-1.jpg'

const Login = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' }); 
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        console.log('Logging in with credentials:', credentials);
        try {
            const response = await axios.post('http://localhost:8080/api/seller/login', credentials);
            console.log('Login Successful', response.date);

            const { firstName, lastName, address, contactNo, email, username, password} = response.data;
            sessionStorage.setItem('username', username);
            sessionStorage.setItem('password', password);
            sessionStorage.setItem('firstName', firstName);
            sessionStorage.setItem('lastName', lastName);
            sessionStorage.setItem('address', address);
            sessionStorage.setItem('contactNo', contactNo);
            sessionStorage.setItem('email', email);

            setErrorMessage('')
            navigate('/sell');
        } catch (error) {
            setErrorMessage('Invalid username or password');
            console.error('Error logging in: ', error);
        }
    };

  return (
    <div className="login-container">
      <div className="form-container">
        <img src={logo} alt="Logo" className="logo" /> 
        <h2>Welcome to CIT-U Marketplace</h2>
        <span>Login to your account</span>

        <form onSubmit={handleLogin}>
          {errorMessage && 
            <div className="error-message">{errorMessage}</div>
          }

        <div className="form-group">
            <input 
            type="text" 
            name="username" 
            placeholder='Username'
            value={credentials.username}
            onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
            />
          </div>
          
          <div className="form-group">
            <input 
            type="password" 
            name="password" 
            placeholder='Password'
            value={credentials.password}
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value})}
            />
          </div>
          <div className="button-container">
            <button type="submit">Login</button>
            <p className="signup-text">Don't have an account?  <Link to="/register">Sign up for free</Link></p>
          </div>
        </form>
      </div>
      <div className="image-container">
        <img src={cit} alt="Registration" className="registration-image" /> 
      </div>
    </div>
  );
};

export default Login;
