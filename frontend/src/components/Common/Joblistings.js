import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../../api_config';
import { Link, useHistory } from "react-router-dom";

const Joblistings = () => {
    const history = useHistory();
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (localStorage.getItem('user_type') !== "recruiter" || localStorage.getItem('isloggedin') !== "true") {
            history.push("/login");
            return;
        }

        const fetchListings = async () => {
            try {
                const email = localStorage.getItem('user_email');
                const response = await axios.post(API_URL + '/job/job/view', { email_rec: email });
                setListings(response.data);
            } catch (error) {
                console.error("Error fetching jobs:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchListings();
    }, [history]);

    const deleteJob = async (id) => {
        if (window.confirm("Are you sure you want to delete this job posting?")) {
            try {
                await axios.post(API_URL + '/job/job/delete', { 'id': id });
                setListings(listings.filter(el => el._id !== id));
            } catch (error) {
                console.error("Error deleting job:", error);
                alert("Failed to delete job.");
            }
        }
    };

    return (
        <div className="container dashboard-container">
            <div className="header-flex">
                <h1 className="page-title">Your Job Listings</h1>
                <Link to="/addjob" className="btn-primary">
                    <span style={{ marginRight: '0.5rem', fontSize: '1.2em', lineHeight: 1 }}>+</span> Post New Job
                </Link>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>
            ) : (
                <div className="jobs-grid">
                    {listings.map((job) => (
                        <div key={job._id} className="glass job-card">
                            <div className="job-header">
                                <h3 className="job-title">{job.title}</h3>
                                <div className={`status-badge ${job.number_of_positions_filled >= job.max_positions ? 'full' : 'active'}`}>
                                    {job.number_of_positions_filled >= job.max_positions ? 'Closed' : 'Active'}
                                </div>
                            </div>

                            <div className="job-body">
                                <div className="info-row">
                                    <span className="info-label">Posted Date</span>
                                    <span className="info-value">{new Date(job.date_of_posting).toLocaleDateString()}</span>
                                </div>
                                <div className="info-row">
                                    <span className="info-label">Type</span>
                                    <span className="info-value text-capitalize">{job.type_of_job.replace(/_/g, ' ')}</span>
                                </div>

                                <div className="stats-row">
                                    <div className="stat-item">
                                        <div className="stat-value">{job.max_applications}</div>
                                        <div className="stat-label">Max Apps</div>
                                    </div>
                                    <div className="stat-item">
                                        <div className="stat-value">{job.max_positions}</div>
                                        <div className="stat-label">Positions</div>
                                    </div>
                                    <div className="stat-item">
                                        <div className="stat-value">{job.number_of_positions_filled}</div>
                                        <div className="stat-label">Filled</div>
                                    </div>
                                </div>
                            </div>

                            <div className="actions-grid">
                                <Link to={"/job-listings/" + job._id} className="action-btn view-btn">View</Link>
                                <Link to={"/edit-job/" + job._id} className="action-btn edit-btn">Edit</Link>
                                <button
                                    onClick={() => deleteJob(job._id)}
                                    className="action-btn delete-btn"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {listings.length === 0 && !loading && (
                <div className="empty-state">
                    <p>You haven't posted any jobs yet.</p>
                    <Link to="/addjob" className="text-link">Create your first job posting</Link>
                </div>
            )}

            <style>{`
                .dashboard-container {
                    padding: 2rem 1rem;
                }
                .header-flex {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2.5rem;
                }
                .page-title {
                    font-size: 2rem;
                    font-weight: 700;
                    margin: 0;
                }
                .jobs-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
                    gap: 1.5rem;
                }
                .job-card {
                    padding: 1.5rem;
                    border-radius: var(--radius-lg);
                    display: flex;
                    flex-direction: column;
                    transition: transform 0.2s;
                }
                .job-card:hover {
                    transform: translateY(-5px);
                }
                .job-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 1.5rem;
                }
                .job-title {
                    font-size: 1.25rem;
                    font-weight: 700;
                    margin: 0;
                    color: var(--text-main);
                    line-height: 1.3;
                }
                .status-badge {
                    font-size: 0.75rem;
                    font-weight: 600;
                    padding: 0.25rem 0.75rem;
                    border-radius: 20px;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                .status-badge.active {
                    background-color: rgba(16, 185, 129, 0.1); /* emerald-50 */
                    color: var(--secondary);
                }
                .status-badge.full {
                    background-color: rgba(239, 68, 68, 0.1);
                    color: var(--danger);
                }
                .job-body {
                    flex: 1;
                }
                .info-row {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 0.75rem;
                    font-size: 0.95rem;
                }
                .info-label {
                    color: var(--text-secondary);
                }
                .info-value {
                    font-weight: 500;
                    color: var(--text-main);
                }
                .text-capitalize {
                    text-transform: capitalize;
                }
                .stats-row {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 1.5rem;
                    padding-top: 1rem;
                    border-top: 1px solid var(--border-glass);
                }
                .stat-item {
                    text-align: center;
                }
                .stat-value {
                    font-size: 1.1rem;
                    font-weight: 700;
                    color: var(--primary);
                }
                .stat-label {
                    font-size: 0.75rem;
                    color: var(--text-tertiary);
                    text-transform: uppercase;
                }
                .actions-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr 1fr;
                    gap: 0.75rem;
                    margin-top: 1.5rem;
                }
                .action-btn {
                    padding: 0.5rem;
                    border-radius: var(--radius-md);
                    font-size: 0.9rem;
                    font-weight: 600;
                    text-align: center;
                    text-decoration: none;
                    cursor: pointer;
                    transition: all 0.2s;
                    border: 1px solid transparent;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .view-btn {
                    background-color: white;
                    color: var(--text-main);
                    border-color: var(--border);
                }
                .view-btn:hover {
                    box-shadow: var(--shadow-sm);
                    color: var(--text-main);
                    text-decoration: none;
                }
                .edit-btn {
                    background-color: rgba(245, 158, 11, 0.1);
                    color: var(--warning);
                }
                .edit-btn:hover {
                     background-color: rgba(245, 158, 11, 0.2);
                     color: var(--warning);
                     text-decoration: none;
                }
                .delete-btn {
                    background-color: rgba(239, 68, 68, 0.1);
                    color: var(--danger);
                }
                .delete-btn:hover {
                    background-color: rgba(239, 68, 68, 0.2);
                }
                .empty-state {
                    text-align: center;
                    padding: 4rem 1rem;
                    background: var(--bg-surface);
                    border-radius: var(--radius-lg);
                    border: 1px dashed var(--border);
                    color: var(--text-secondary);
                }
                .text-link {
                    color: var(--primary);
                    font-weight: 600;
                    text-decoration: none;
                }
                .text-link:hover {
                    text-decoration: underline;
                }
            `}</style>
        </div>
    );
};

export default Joblistings;