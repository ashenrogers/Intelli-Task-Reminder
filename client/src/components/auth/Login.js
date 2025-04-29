import React, { useState, useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import './Login.css';
import { login } from '../../actions/auth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Login = ({ login, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const { email, password } = formData;

  const validateEmail = (email) => {
    if (!email) return 'Email is required';
    if (!/\S+@\S+\.\S+/.test(email)) return 'Invalid email format';
    return '';
  };

  const validatePassword = (password) => {
    if (!password) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters';
    return '';
  };

  // Re-validate on every keystroke
  useEffect(() => {
    setErrors({
      email: validateEmail(email),
      password: validatePassword(password)
    });
  }, [email, password]);

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);
  const toggleRememberMe = () => setRememberMe(!rememberMe);

  const onSubmit = async e => {
    e.preventDefault();

    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (emailError || passwordError) {
      setErrors({ email: emailError, password: passwordError });
      toast.error('Please fix the errors before submitting.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await login(email, password, rememberMe);
      if (result?.success) {
        toast.success('Successfully logged in!');
      } else {
        toast.error('Invalid email or password');
      }
    } catch {
      toast.error('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthenticated) {
    toast.dismiss();
    return <Redirect to="/dashboard" />;
  }

  return (
    <div className="login-page">
      <ToastContainer />
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h1 className="login-title">Welcome Back</h1>
            <p className="login-subtitle">Sign in to your account</p>
          </div>

          <form className="login-form" onSubmit={onSubmit}>
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email Address</label>
              <div className="input-group">
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  name="email"
                  value={email}
                  onChange={onChange}
                  className="form-input"
                  autoComplete="email"
                />
              </div>
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            <div className="form-group">
              <div className="password-header">
                <label htmlFor="password" className="form-label">Password</label>
                <Link to="/forgot-password" className="forgot-password">Forgot password?</Link>
              </div>
              <div className="input-group">
                <input
                  id="password"
                  type={passwordVisible ? 'text' : 'password'}
                  placeholder="Enter your password"
                  name="password"
                  value={password}
                  onChange={onChange}
                  className="form-input"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={togglePasswordVisibility}
                  aria-label={passwordVisible ? 'Hide password' : 'Show password'}
                >
                  <i className={passwordVisible ? 'eye-slash-icon' : 'eye-icon'}></i>
                </button>
              </div>
              {errors.password && <span className="error-text">{errors.password}</span>}
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

          <div className="login-divider"><span className="divider-text">or continue with</span></div>

          <div className="social-login">
            <button type="button" className="social-button google-button">
              <i className="google-icon"></i><span>Google</span>
            </button>
            <button type="button" className="social-button facebook-button">
              <i className="facebook-icon"></i><span>Facebook</span>
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
