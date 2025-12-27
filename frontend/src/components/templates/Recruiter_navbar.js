import React from 'react';
import { Link } from "react-router-dom";

const RecruiterNavbar = () => {
    return (
        <header className="navbar-glass glass">
            <div className="container nav-content">
                <Link to="/" className="brand-logo">
                    CareerHub
                </Link>
                <nav>
                    <ul className="nav-items">
                        <li>
                            <Link to="/profileedit_recruiter" className="nav-link">Profile</Link>
                        </li>
                        <li>
                            <Link to="/addjob" className="nav-link">Add Job</Link>
                        </li>
                        <li>
                            <Link to="/job-listings" className="nav-link">Job Listings</Link>
                        </li>
                        <li>
                            <Link to="/my-employees" className="nav-link">My Employees</Link>
                        </li>
                        <li>
                            <Link to="/" className="nav-btn" onClick={() => {
                                localStorage.clear();
                                window.location.href = "/";
                            }}>Logout</Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default RecruiterNavbar;