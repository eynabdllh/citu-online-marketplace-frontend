import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext'; 
import '../../assets/static/Login.css';
import logo from '../../assets/img/logocit-1.png';
import cit from '../../assets/img/cit-1.jpg';

const AdminLogin = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [errorMessage, setErrorMessage] = useState('');
    const { login } = useAuth(); // Use login function from AuthContext
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!credentials.username || !credentials.password) {
            setErrorMessage('Please enter username and password');
            return;
        }
  
        console.log('Logging in with credentials:', credentials);
        try {
            const response = await axios.post('http://localhost:8080/api/admin/login', credentials);
            console.log('Login Successful', response.data);
            const userData = response.data;

            // Add role to userData
            userData.role = 'ADMIN';
            
            // Call login from AuthContext with the user data
            login(userData);
            setErrorMessage('')
            navigate('/admin/dashboard');
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
                <span>Admin Access Module</span>
                <form onSubmit={handleLogin}>
                    {errorMessage && 
                    <div className="error-message">{errorMessage}</div>
                    }
                    <div className="form-group">
                        <input 
                            type="text" 
                            name="username" 
                            placeholder="Username"
                            value={credentials.username}
                            onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <input 
                            type="password" 
                            name="password" 
                            placeholder="Password"
                            value={credentials.password}
                            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                        />
                    </div>
                    <div className="button-container">
                        <button type="submit">Login</button>
                    </div>
                </form>
            </div>
            <div className="image-container">
                <img src={cit} alt="Registration" className="registration-image" />
            </div>
        </div>
    );
};

export default AdminLogin;
