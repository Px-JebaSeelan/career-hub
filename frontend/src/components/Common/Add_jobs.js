import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../../api_config';
import { useHistory } from "react-router-dom";

const AddJob = () => {
    const history = useHistory();
    const isMounted = useRef(true);

    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);

    const [formData, setFormData] = useState({
        title: '',
        max_applications: '',
        max_positions: '',
        deadline_of_application: '',
        required_skills: '',
        type_of_job: 'full_time',
        duration: '0',
        salary_per_month: '',
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        const newJob = {
            ...formData,
            name_recruiter: localStorage.getItem('user_name'),
            email_recruiter: localStorage.getItem('user_email'),
            date_of_posting: Date.now()
        };

        if (localStorage.getItem('user_type') !== 'recruiter' || localStorage.getItem('isloggedin') !== 'true') {
            alert("Please login as a recruiter first.");
            history.push("/");
            return;
        }

        axios.post(API_URL + '/job/job/add', newJob)
            .then(res => {
                alert("Job Posted Successfully!");
                if (isMounted.current) {
                    history.push("/joblistings");
                }
            })
            .catch(error => {
                console.log(error);
                alert("Error posting job.");
            })
            .finally(() => {
                if (isMounted.current) {
                    setLoading(false);
                }
            });
    };

    return (
        <div className="container" style={{ padding: '3rem 1rem', display: 'flex', justifyContent: 'center' }}>
            <div className="glass" style={{ width: '100%', maxWidth: '800px', padding: '2.5rem', borderRadius: 'var(--radius-xl)' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Post a New Job</h2>

                <form onSubmit={onSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
                    <div className="form-group">
                        <label>Job Title/Designation</label>
                        <input
                            type="text"
                            name="title"
                            className="form-input"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g. Senior Software Engineer"
                            required
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                            <label>Vacancies</label>
                            <input
                                type="number"
                                name="max_positions"
                                className="form-input"
                                min="1"
                                value={formData.max_positions}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Max Applicants</label>
                            <input
                                type="number"
                                name="max_applications"
                                className="form-input"
                                min="1"
                                value={formData.max_applications}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                            <label>Application Deadline</label>
                            <input
                                type="datetime-local"
                                name="deadline_of_application"
                                className="form-input"
                                value={formData.deadline_of_application}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Monthly Salary ($)</label>
                            <input
                                type="number"
                                name="salary_per_month"
                                className="form-input"
                                min="1"
                                value={formData.salary_per_month}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Required Skills <span style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>(comma separated)</span></label>
                        <input
                            type="text"
                            name="required_skills"
                            className="form-input"
                            value={formData.required_skills}
                            onChange={handleChange}
                            placeholder="e.g. Python, React, AWS"
                            required
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                            <label>Job Type</label>
                            <select name="type_of_job" className="form-input" value={formData.type_of_job} onChange={handleChange}>
                                <option value="full_time">Full Time</option>
                                <option value="part_time">Part Time</option>
                                <option value="work_from_home">Work From Home</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Duration / Notice Period</label>
                            <select name="duration" className="form-input" value={formData.duration} onChange={handleChange}>
                                <option value="0">Immediate</option>
                                <option value="1">15 Days</option>
                                <option value="2">45 Days</option>
                                <option value="3">90 Days</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ marginTop: '1rem' }}>
                        <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={loading}>
                            {loading ? 'Posting...' : 'Post Job'}
                        </button>
                    </div>
                </form>
            </div>

            <style>{`
                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }
                .form-group label {
                    font-weight: 600;
                    font-size: 0.9rem;
                    color: var(--text-main);
                }
                .form-input {
                    padding: 0.75rem;
                    border: 1px solid var(--border);
                    border-radius: var(--radius-md);
                    font-family: var(--font-sans);
                    width: 100%;
                }
            `}</style>
        </div>
    );
};

export default AddJob;