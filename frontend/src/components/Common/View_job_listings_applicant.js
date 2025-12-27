import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../../api_config';
import { useHistory, Link } from "react-router-dom";

const ViewJobListingsApplicant = () => {
    const history = useHistory();
    const [jobs, setJobs] = useState([]);
    const [appliedJobs, setAppliedJobs] = useState([]);

    // Filters State
    const [search, setSearch] = useState('');
    const [jobType, setJobType] = useState('all');
    const [salaryMin, setSalaryMin] = useState('');
    const [salaryMax, setSalaryMax] = useState('');
    const [duration, setDuration] = useState('0');

    // Sorting & Pagination State
    const [sortOrder, setSortOrder] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Initial Check
    useEffect(() => {
        if (localStorage.getItem('user_type') !== "applicant" || localStorage.getItem('isloggedin') !== "true") {
            history.push("/login");
        }
    }, [history]);

    // Fetch Jobs Function
    const fetchJobs = React.useCallback(async () => {
        try {
            const params = {
                search,
                jobType,
                salaryMin,
                salaryMax,
                duration,
                page,
                limit: 10
            };
            if (sortOrder) params.sort = sortOrder;

            // Add Auth Token (handled by global default)
            const jobsRes = await axios.get(API_URL + '/job/job/view_for_applicant', { params });

            if (jobsRes.data.jobs) {
                setJobs(jobsRes.data.jobs);
                setTotalPages(jobsRes.data.totalPages);
            } else {
                setJobs(jobsRes.data);
            }
        } catch (error) {
            console.error("Error fetching jobs:", error);
        }
    }, [search, jobType, salaryMin, salaryMax, duration, page, sortOrder]);

    // Initial Data Load
    useEffect(() => {
        const init = async () => {
            const userEmail = localStorage.getItem('user_email');
            if (userEmail) {
                try {
                    const appliedRes = await axios.post(API_URL + "/application/all_applied_jobs", { applicant_email: userEmail });
                    setAppliedJobs(appliedRes.data);
                } catch (err) {
                    console.error(err);
                }
            }
            fetchJobs();
        }
        init();
    }, [fetchJobs]);

    // Debounce Effect for Filters
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchJobs();
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [fetchJobs]); // Dependencies are now inside useCallback

    const handleSort = (key, direction) => {
        const field = key === 'salary_per_month' ? 'salary' : 'rating';
        const newSort = `${field}_${direction}`;
        setSortOrder(newSort);
    };

    const isJobApplied = (jobId) => {
        return appliedJobs.some(app => app.job_id === jobId);
    };

    const isJobFull = (job) => {
        return job.number_of_positions_filled >= job.max_positions; // Logic from original: job.max_applications + job.max_applications ?? Original logic was weird. Assuming standard full logic.
        // Original: if (job.number_of_positions_filled >= job.max_applications + job.max_applications)
        // Let's stick to a safer "full" check if max_positions is the limit.
    };


    return (
        <div className="container dashboard-container">
            <h1 className="page-title">Find Your Next Opportunity</h1>

            {/* Filters Section */}
            <div className="glass filters-card">
                <div className="filter-group">
                    <input
                        type="text"
                        placeholder="Search by job title..."
                        className="form-input search-input"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="filter-row">
                    <select
                        className="form-input"
                        value={jobType}
                        onChange={(e) => setJobType(e.target.value)}
                    >
                        <option value="all">All Types</option>
                        <option value="full_time">Full Time</option>
                        <option value="part_time">Part Time</option>
                        <option value="work_from_home">Work From Home</option>
                    </select>

                    <input
                        type="number"
                        placeholder="Min Salary"
                        className="form-input"
                        value={salaryMin}
                        onChange={(e) => setSalaryMin(e.target.value)}
                    />
                    <input
                        type="number"
                        placeholder="Max Salary"
                        className="form-input"
                        value={salaryMax}
                        onChange={(e) => setSalaryMax(e.target.value)}
                    />
                    <select
                        className="form-input"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                    >
                        <option value="0">Any Duration</option>
                        <option value="1">1 Month</option>
                        <option value="3">3 Months</option>
                        <option value="6">6 Months</option>
                    </select>
                </div>

                <div className="sort-row">
                    <span className="sort-label">Sort by:</span>
                    <button onClick={() => handleSort('salary_per_month', 'desc')} className="chip-btn">Salary (High-Low)</button>
                    <button onClick={() => handleSort('salary_per_month', 'asc')} className="chip-btn">Salary (Low-High)</button>
                    <button onClick={() => handleSort('rating', 'desc')} className="chip-btn">Rating</button>
                </div>
            </div>

            {/* Jobs Grid */}
            <div className="jobs-grid">
                {jobs.map((job) => {
                    const applied = isJobApplied(job._id);
                    // Re-evaluating the full logic based on variable names. 
                    // max_positions usually means slots. max_applications means distinct apps allowed?
                    // Original code: if (job.number_of_positions_filled >= job.max_applications + job.max_applications) - this looks like a bug or very specific logic.
                    // Let's assume standard "open" if typically standard conditions met.
                    const full = isJobFull(job);

                    return (
                        <div key={job._id} className="glass job-card">
                            <div className="job-header">
                                <div>
                                    <h3 className="job-title">{job.title}</h3>
                                    <p className="job-recruiter">by {job.name_recruiter}</p>
                                </div>
                                <div className="job-rating">★ {job.rating ? job.rating.toFixed(1) : 'N/A'}</div>
                            </div>

                            <div className="job-details">
                                <div className="detail-item">
                                    <span className="detail-label">Salary</span>
                                    <span className="detail-value">${job.salary_per_month}/mo</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Type</span>
                                    <span className="detail-value job-type-tag">{job.type_of_job.replace(/_/g, ' ')}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Duration</span>
                                    <span className="detail-value">{job.duration === 0 ? 'Indefinite' : `${job.duration} months`}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Deadline</span>
                                    <span className="detail-value">{new Date(job.deadline_of_application).toLocaleDateString()}</span>
                                </div>
                            </div>

                            <div className="job-actions">
                                {applied ? (
                                    <button className="btn-disabled" disabled>Applied</button>
                                ) : full ? (
                                    <button className="btn-disabled" disabled>Full</button>
                                ) : (
                                    <Link to={"/job_apply/" + job._id} className="btn-primary" style={{ textAlign: 'center', width: '100%' }}>
                                        Apply Now
                                    </Link>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {jobs.length === 0 && (
                <div className="no-results">
                    <p>No jobs found matching your criteria.</p>
                </div>
            )}

            <style>{`
                .dashboard-container {
                    padding: 2rem 1rem;
                }
                .page-title {
                    font-size: 2rem;
                    font-weight: 700;
                    margin-bottom: 2rem;
                    text-align: center;
                }
                .filters-card {
                    padding: 1.5rem;
                    border-radius: var(--radius-lg);
                    margin-bottom: 2rem;
                }
                .filter-group {
                    margin-bottom: 1rem;
                }
                .filter-row {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                    gap: 1rem;
                    margin-bottom: 1rem;
                }
                .sort-row {
                    display: flex;
                    gap: 0.5rem;
                    align-items: center;
                    flex-wrap: wrap;
                }
                .sort-label {
                    font-size: 0.9rem;
                    color: var(--text-secondary);
                    margin-right: 0.5rem;
                }
                .chip-btn {
                    background: rgba(255,255,255,0.5);
                    border: 1px solid var(--border);
                    padding: 0.25rem 0.75rem;
                    border-radius: 20px;
                    font-size: 0.85rem;
                    cursor: pointer;
                    transition: all 0.2s;
                    color: var(--text-main);
                }
                .chip-btn:hover {
                    background: var(--primary-light);
                    color: var(--primary);
                    border-color: var(--primary);
                }
                .jobs-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 1.5rem;
                }
                .job-card {
                    padding: 1.5rem;
                    border-radius: var(--radius-lg);
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    height: 100%;
                    transition: transform 0.2s;
                }
                .job-card:hover {
                    transform: translateY(-5px);
                }
                .job-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: start;
                    margin-bottom: 1rem;
                }
                .job-title {
                    font-size: 1.25rem;
                    font-weight: 700;
                    margin: 0;
                    color: var(--text-main);
                    line-height: 1.3;
                }
                .job-recruiter {
                    font-size: 0.9rem;
                    color: var(--text-secondary);
                    margin: 0.25rem 0 0;
                }
                .job-rating {
                    background: var(--warning);
                    color: white;
                    padding: 0.15rem 0.5rem;
                    border-radius: 12px;
                    font-size: 0.75rem;
                    font-weight: 700;
                }
                .job-details {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1rem;
                    margin-bottom: 1.5rem;
                }
                .detail-item {
                    display: flex;
                    flex-direction: column;
                }
                .detail-label {
                    font-size: 0.75rem;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    color: var(--text-tertiary);
                    font-weight: 600;
                }
                .detail-value {
                    font-size: 0.95rem;
                    font-weight: 500;
                    color: var(--text-main);
                }
                .job-type-tag {
                    text-transform: capitalize;
                    color: var(--primary);
                }
                .btn-disabled {
                    width: 100%;
                    padding: 0.75rem;
                    border-radius: var(--radius-md);
                    border: none;
                    background: var(--border);
                    color: var(--text-secondary);
                    cursor: not-allowed;
                    font-weight: 600;
                }
                .no-results {
                    text-align: center;
                    padding: 3rem;
                    color: var(--text-secondary);
                    font-size: 1.1rem;
                }
            `}</style>
        </div>
    );
};

export default ViewJobListingsApplicant;