import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import './Login.css';
import { login } from '../../actions/auth';

const Login = ({ login, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  const { email, password } = formData;
  
  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
  
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  
  const toggleRememberMe = () => {
    setRememberMe(!rememberMe);
  };
  
  const onSubmit = async e => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password, rememberMe);
    } finally {
      setIsLoading(false);
    }
  };

  // Redirect if authenticated
  if (isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h1 className="login-title">Welcome Back</h1>
            <p className="login-subtitle">Sign in to your account</p>
          </div>
          
          <form className="login-form" onSubmit={e => onSubmit(e)}>
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email Address</label>
              <div className="input-group">
                <span className="input-icon">
                  <i className="email-icon"></i>
                </span>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  name="email"
                  value={email}
                  onChange={e => onChange(e)}
                  required
                  className="form-input"
                  autoComplete="email"
                />
              </div>
            </div>
            
            <div className="form-group">
              <div className="password-header">
                <label htmlFor="password" className="form-label">Password</label>
                <Link to="/forgot-password" className="forgot-password">
                  Forgot password?
                </Link>
              </div>
              <div className="input-group">
                <span className="input-icon">
                  <i className="lock-icon"></i>
                </span>
                <input
                  id="password"
                  type={passwordVisible ? "text" : "password"}
                  placeholder="Enter your password"
                  name="password"
                  minLength="6"
                  value={password}
                  onChange={e => onChange(e)}
                  required
                  className="form-input"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={togglePasswordVisibility}
                  aria-label={passwordVisible ? "Hide password" : "Show password"}
                >
                  <i className={passwordVisible ? "eye-slash-icon" : "eye-icon"}></i>
                </button>
              </div>
            </div>
            
            <div className="form-group remember-me-group">
              <label className="checkbox-container">
                <input 
                  type="checkbox" 
                  checked={rememberMe} 
                  onChange={toggleRememberMe}
                  className="remember-checkbox"
                />
                <span className="checkmark"></span>
                <span className="checkbox-label">Remember me</span>
              </label>
            </div>
            
            <div className="form-group">
              <button
                type="submit"
                className={`login-button ${isLoading ? 'loading' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>
            </div>
          </form>
          
          <div className="login-divider">
            <span className="divider-text">or continue with</span>
          </div>
          
          <div className="social-login">
            <button type="button" className="social-button google-button">
              <i className="google-icon"></i>
              <span>Google</span>
            </button>
            <button type="button" className="social-button facebook-button">
              <i className="facebook-icon"></i>
              <span>Facebook</span>
            </button>
          </div>
          
          <div className="login-footer">
            <p className="signup-link">
              Don't have an account? <Link to="/register" className="auth-link">Sign Up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

Login.propTypes = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { login })(Login);