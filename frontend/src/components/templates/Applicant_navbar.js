import React from 'react';
import { Link, useHistory } from "react-router-dom";

const ApplicantNavbar = () => {
    const history = useHistory();

    const handleLogout = () => {
        localStorage.clear();
        history.push("/");
    };

    // Keeping the original window.location.href logic for safety as per original code, but wrapped in function.
    // The original code used window.location.href inside onClick. 

    return (
        <header className="navbar-glass glass">
            <div className="container nav-content">
                <Link to="/" className="brand-logo">
                    CareerHub
                </Link>
                <nav>
                    <ul className="nav-items">
                        <li>
                            <Link to="/profileedit_applicant" className="nav-link">Profile</Link>
                        </li>
                        <li>
                            <Link to="/search_job" className="nav-link">Jobs</Link>
                        </li>
                        <li>
                            <Link to="/my_applications" className="nav-link">My Applications</Link>
                        </li>
                        <li>
                            <button className="nav-btn" onClick={handleLogout}>Logout</button>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default ApplicantNavbar;