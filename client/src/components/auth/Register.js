import React, { useState } from "react";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import { setAlert } from "../../actions/alert";
import { register } from "../../actions/auth";
import PropTypes from "prop-types";
import './Register.css';

const Register = ({ setAlert, register, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password2: ""
  });
  
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { name, email, password, password2 } = formData;
  
  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
    
  const onSubmit = async e => {
    e.preventDefault();
    if (password !== password2) {
      setAlert("Passwords do not match", "danger");
    } else {
      setIsLoading(true);
      try {
        await register({ name, email, password });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  // Redirect if authenticated
  if (isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-card">
          <div className="register-header">
            <h1 className="register-title">Create Account</h1>
            <p className="register-subtitle">Join our community today</p>
          </div>
          
          <form className="register-form" onSubmit={e => onSubmit(e)}>


            <div className="form-group">
              <label htmlFor="name" className="form-label">Full name</label>
              <div className="input-group">
                <span className="input-icon">
                  <i className="user-icon"></i>
                </span>
                <input
                  id="name"
                  type="plaintext"
                  placeholder="Enter your full name"
                  name="name"
                  value={name}
                  onChange={e => onChange(e)}
                  required
                  className="form-input"
                />
              </div>
            </div>
            
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
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <div className="input-group">
                <span className="input-icon">
                  <i className="lock-icon"></i>
                </span>
                <input
                  id="password"
                  type={passwordVisible ? "text" : "password"}
                  placeholder="Create a password"
                  name="password"
                  minLength="6"
                  value={password}
                  onChange={e => onChange(e)}
                  required
                  className="form-input"
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
              <small className="password-hint">Must be at least 6 characters</small>
            </div>
            
            <div className="form-group">
              <label htmlFor="password2" className="form-label">Confirm Password</label>
              <div className="input-group">
                <span className="input-icon">
                  <i className="lock-icon"></i>
                </span>
                <input
                  id="password2"
                  type={confirmPasswordVisible ? "text" : "password"}
                  placeholder="Confirm your password"
                  name="password2"
                  minLength="6"
                  value={password2}
                  onChange={e => onChange(e)}
                  required
                  className="form-input"
                />
                <button 
                  type="button" 
                  className="password-toggle"
                  onClick={toggleConfirmPasswordVisibility}
                  aria-label={confirmPasswordVisible ? "Hide password" : "Show password"}
                >
                  <i className={confirmPasswordVisible ? "eye-slash-icon" : "eye-icon"}></i>
                </button>
              </div>
            </div>
            
            <div className="form-group">
              <button 
                type="submit" 
                className={`register-button ${isLoading ? 'loading' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>
            </div>
          </form>
          
          <div className="register-footer">
            <p className="login-link">
              Already have an account?{' '}
              <Link to="/login" className="auth-link">Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { setAlert, register })(Register);