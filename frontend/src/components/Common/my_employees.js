import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../../api_config';
import { useHistory, Link } from "react-router-dom";

const MyEmployees = () => {
    const history = useHistory();
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);

    // Sorting State
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

    useEffect(() => {
        if (localStorage.getItem('user_type') === "recruiter" && localStorage.getItem('isloggedin') === "true") {
            const email = localStorage.getItem('user_email');
            axios.post(API_URL + '/application/all_my_employees', { email_rec: email })
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

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const sortedListings = React.useMemo(() => {
        let sortableItems = [...listings];
        if (sortConfig.key !== null) {
            sortableItems.sort((a, b) => {
                let aVal = a[sortConfig.key];
                let bVal = b[sortConfig.key];

                // Handle special cases (like dates or numbers if needed, but strings work for now)

                if (aVal < bVal) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (aVal > bVal) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [listings, sortConfig]);

    const getSortIndicator = (name) => {
        if (sortConfig.key !== name) return '↕'; // Neutral Sort Icon
        return sortConfig.direction === 'ascending' ? '↑' : '↓';
    };

    return (
        <div className="container" style={{ padding: '3rem 1rem' }}>
            <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-xl)' }}>
                <h2 style={{ marginBottom: '2rem', textAlign: 'center' }}>My Employees</h2>

                {loading ? (
                    <div className="text-center">Loading employees...</div>
                ) : listings.length === 0 ? (
                    <div className="text-center" style={{ color: 'var(--text-secondary)' }}>No employees found.</div>
                ) : (
                    <div className="table-container">
                        <table className="glass-table">
                            <thead>
                                <tr>
                                    <th onClick={() => requestSort('name_applicant')} style={{ cursor: 'pointer' }}>
                                        Applicant Name {getSortIndicator('name_applicant')}
                                    </th>
                                    <th onClick={() => requestSort('date_of_joining')} style={{ cursor: 'pointer' }}>
                                        Date of Joining {getSortIndicator('date_of_joining')}
                                    </th>
                                    <th onClick={() => requestSort('job_type')} style={{ cursor: 'pointer' }}>
                                        Job Type {getSortIndicator('job_type')}
                                    </th>
                                    <th onClick={() => requestSort('job_title')} style={{ cursor: 'pointer' }}>
                                        Job Title {getSortIndicator('job_title')}
                                    </th>
                                    <th onClick={() => requestSort('applicant_rating')} style={{ cursor: 'pointer' }}>
                                        Rating {getSortIndicator('applicant_rating')}
                                    </th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedListings.map((app, i) => (
                                    <tr key={i}>
                                        <td>{app.name_applicant}</td>
                                        <td>{app.date_of_joining}</td>
                                        <td><span className="badge badge-neutral">{app.job_type}</span></td>
                                        <td><strong>{app.job_title}</strong></td>
                                        <td>
                                            <span className="badge badge-warning">★ {app.applicant_rating.toFixed(1)}</span>
                                        </td>
                                        <td>
                                            <Link to={"/my-employees/" + app.applicant_email} className="btn-primary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.85rem' }}>
                                                Rate
                                            </Link>
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

export default MyEmployees;