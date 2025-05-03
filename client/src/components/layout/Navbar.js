import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../../actions/auth';
import './Navbar.css';

const Navbar = ({ isAuthenticated, loading, logout }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };
//dsfsdfsdjnfksdf
    const authLinks = (
        <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
            <li>
                
            </li>
            <li>
                <Link to='/dashboard' onClick={toggleMenu}>
                    Dashboard
                </Link>
            </li>
            <li>
                <Link to='/tasks' onClick={toggleMenu}>
                    Tasks
                </Link>  
            </li>
            
            <li>
                <Link onClick={() => {
                    logout();
                    toggleMenu();
                }} to="/">
                    Logout
                </Link>
            </li>
        </ul>
    );

    const guestLinks = ( 
        <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
            <li><Link to="/admin" onClick={toggleMenu}>AdminLogin</Link></li>
            <li><Link to="/register" onClick={toggleMenu}>Register</Link></li>
            <li><Link to="/login" onClick={toggleMenu}>Login</Link></li>
        </ul>
    );
      
    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="logo">
                    <Link to="/">
                        <i className="fas fa-sticky-note"></i> TaskReminder
                    </Link>
                </div>
                
                {/* Hamburger Menu for Mobile */}
                <div className={`hamburger ${isMenuOpen ? 'open' : ''}`} onClick={toggleMenu}>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>

                <Fragment>
                    {(!loading && isAuthenticated) ? authLinks : guestLinks}
                </Fragment>
            </div>
        </nav>
    );
};

Navbar.propTypes = {
    logout: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool,
    loading: PropTypes.bool
};

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    loading: state.auth.loading
});

export default connect(mapStateToProps, { logout })(Navbar);