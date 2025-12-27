import React from 'react';
import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <header className="navbar-glass glass">
            <div className="container nav-content">
                <Link to="/" className="brand-logo">
                    CareerHub
                </Link>
                <nav>
                    <ul className="nav-items">
                        <li>
                            <Link to="/register" className="nav-link">Register</Link>
                        </li>
                        <li>
                            <Link to="/login" className="nav-btn">Login</Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Navbar;