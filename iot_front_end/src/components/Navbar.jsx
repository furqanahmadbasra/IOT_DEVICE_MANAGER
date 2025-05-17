import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        if (isMenuOpen) {
            setIsMenuOpen(false);
        }
    };

    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <nav className="navbar">
            <div className="logo">
                <span className="logo-icon">🌐</span>
                <span>IoT Lab</span>
            </div>

            <button className="menu-toggle" onClick={toggleMenu}>
                <span></span>
                <span></span>
                <span></span>
            </button>

            <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
                <Link
                    to="/admin"
                    className={`nav-link ${isActive('/admin') ? 'active' : ''}`}
                    onClick={closeMenu}
                >
                    Admin Dashboard
                </Link>
                <Link
                    to="/user"
                    className={`nav-link ${isActive('/user') ? 'active' : ''}`}
                    onClick={closeMenu}
                >
                    User Dashboard
                </Link>
                <Link
                    to="/user_chart"
                    className={`nav-link ${isActive('/user_chart') ? 'active' : ''}`}  // Fix path here!
                    onClick={closeMenu}
                >
                    UserChartDashboard
                </Link>

            </div>
        </nav>
    );
};

export default Navbar;