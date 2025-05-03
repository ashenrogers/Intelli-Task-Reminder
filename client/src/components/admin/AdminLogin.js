import React, { useState } from 'react';
import './AdminLogin.css';

const AdminLogin = () => {            //changes
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin') {
      // Login successful
      setError('');
      setIsLoggedIn(true);        
      // If you're using React Router v5, you can use this approach:
      // window.location.href = '/dashboard';
      
      // Or if you have a history object available (React Router v5):
      // props.history.push('/dashboard');
      
      // For a simple solution without router dependencies:
      window.location.href = '/profiles';
    } else {
      // Login failed
      setError('Invalid username or password');
    }
  };

  // If logged in, you could also render a redirect component here
  if (isLoggedIn) {
    return <div>Login successful! Redirecting...</div>;
  }

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <h2 className="login-title">Admin Login</h2>
        
        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>
          
          <button type="submit" className="login-button">Login</button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;