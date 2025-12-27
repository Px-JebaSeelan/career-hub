import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../../api_config';
import { useHistory } from "react-router-dom";

const MyApplications = () => {
    const history = useHistory();
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (localStorage.getItem('user_type') === "applicant" && localStorage.getItem('isloggedin') === "true") {
            const email = localStorage.getItem('user_email');
            axios.post(API_URL + '/application/all_my_applications', { email_rec: email })
                .then(response => {
                    setListings(response.data);
                    setLoading(false);
                })
                .catch(error => {
                    console.log(error);
                    setLoading(false);
                });
        } else {
            alert("Please login first.");
            history.push("/");
        }
    }, [history]);

    const getStatusBadge = (status) => {
        switch (status) {
            case 'accepted':
            case 'shortlisted':
                return 'badge badge-success';
            case 'rejected':
                return 'badge badge-danger';
            default:
                return 'badge badge-neutral';
        }
    };

    const handleRate = () => {
        // Placeholder for rating logic
        console.log("Rate Recruiter Clicked");
    };

    return (
        <div className="container" style={{ padding: '3rem 1rem' }}>
            <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-xl)' }}>
                <h2 style={{ marginBottom: '2rem', textAlign: 'center' }}>My Applications</h2>

                {loading ? (
                    <div className="text-center">Loading applications...</div>
                ) : listings.length === 0 ? (
                    <div className="text-center" style={{ color: 'var(--text-secondary)' }}>No applications found.</div>
                ) : (
                    <div className="table-container">
                        <table className="glass-table">
                            <thead>
                                <tr>
                                    <th>Job Title</th>
                                    <th>Date of Joining</th>
                                    <th>Salary (Month)</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {listings.map((app, i) => (
                                    <tr key={i}>
                                        <td><strong>{app.job_title}</strong></td>
                                        <td>{app.date_of_joining ? app.date_of_joining : <span style={{ color: 'var(--text-tertiary)' }}>N/A</span>}</td>
                                        <td>${app.job_salary_per_month}</td>
                                        <td>
                                            <span className={getStatusBadge(app.status)}>{app.status}</span>
                                        </td>
                                        <td>
                                            {app.status === "accepted" && (
                                                <button onClick={handleRate} className="btn-primary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.85rem' }}>
                                                    Rate
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyApplications;