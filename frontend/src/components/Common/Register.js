import React, { useState } from 'react';
import axios from 'axios';
import API_URL from '../../api_config';
import bcrypt from 'bcryptjs';
import { Link, useHistory } from "react-router-dom";

const Register = () => {
    const history = useHistory();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        contact_number: '',
        bio_recruiter: '',
        list_of_languages: '', // "Skills"
        institution: '',
        startyear: '',
        endyear: '',
        image: null,
        cv: null,
    });
    const [education, setEducation] = useState([]);
    const [userType, setUserType] = useState('applicant');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleFileChange = (e, field) => {
        if (e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = function () {
                setFormData(prev => ({
                    ...prev,
                    [field]: reader.result // Base64 string
                }));
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleAddEducation = () => {
        if (!formData.institution || !formData.startyear) {
            alert("Institution and Start Year are required.");
            return;
        }
        const newEdu = {
            institution: formData.institution,
            startyear: formData.startyear,
            endyear: formData.endyear
        };
        setEducation([...education, newEdu]);
        setFormData({ ...formData, institution: '', startyear: '', endyear: '' });
    };

    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (formData.password.length < 6) {
            setLoading(false);
            setError("Password must be at least 6 characters");
            return;
        }
        if (!validateEmail(formData.email)) {
            setLoading(false);
            setError("Invalid email address");
            return;
        }

        try {
            const userCheckRes = await axios.get(API_URL + '/user/user', { params: { email: formData.email } });
            const userExists = userCheckRes.data.some(u => u.email === formData.email);

            if (userExists) {
                setLoading(false);
                setError("Email already registered!");
                return;
            }

            const newUser = {
                name: formData.name,
                email: formData.email,
                password: formData.password, // Send plain text, let backend hash it
                type: userType,
                date: Date.now(),
                bio_recruiter: formData.bio_recruiter,
                contact_number: formData.contact_number,
                list_of_languages: formData.list_of_languages,
                education: education,
                cv: formData.cv,
                image: formData.image,
            };

            if (userType === "recruiter") {
                if (formData.bio_recruiter.split(' ').length > 250) {
                    throw new Error("Bio exceeds 250 words");
                }
                if (formData.contact_number.length !== 10) {
                    throw new Error("Contact number must be 10 digits");
                }
                await axios.post(API_URL + '/recruiter/recruiter/add', newUser);
            } else {
                await axios.post(API_URL + '/applicant/applicant/add', newUser);
            }

            await axios.post(API_URL + '/user/register', newUser);
            // alert("Registration Successful!");
            history.push('/login');

        } catch (err) {
            console.error(err);
            setLoading(false);
            setError(err.message || "Registration failed. Please try again.");
        }
    };

    return (
        <div className="auth-container">
            <div className="glass auth-card registration-card">
                <div className="auth-header">
                    <h1 className="auth-title">Create Account</h1>
                    <p className="auth-subtitle">Join CareerHub today</p>
                </div>

                <div className="tab-group">
                    <button
                        className={`tab-btn ${userType === 'applicant' ? 'active' : ''}`}
                        onClick={() => setUserType('applicant')}
                        type="button"
                    >
                        Job Seeker
                    </button>
                    <button
                        className={`tab-btn ${userType === 'recruiter' ? 'active' : ''}`}
                        onClick={() => setUserType('recruiter')}
                        type="button"
                    >
                        Recruiter
                    </button>
                </div>

                <form onSubmit={onSubmit} className="auth-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label>Full Name</label>
                            <input
                                type="text"
                                name="name"
                                className="form-input"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Email Address</label>
                            <input
                                type="email"
                                name="email"
                                className="form-input"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <div className="password-input-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                className="form-input"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                    </div>

                    {userType === 'applicant' && (
                        <>
                            <div className="form-group">
                                <label>Skills <span className="label-hint">(comma separated)</span></label>
                                <input
                                    type="text"
                                    name="list_of_languages"
                                    className="form-input"
                                    placeholder="e.g. Java, React, Python"
                                    value={formData.list_of_languages}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="file-upload-label">
                                        <span>Upload Profile Picture</span>
                                        <input type="file" onChange={(e) => handleFileChange(e, 'image')} />
                                        {formData.image ? <span className="file-status success">✓ Selected</span> : <span className="file-status">No file chosen</span>}
                                    </label>
                                </div>
                                <div className="form-group">
                                    <label className="file-upload-label">
                                        <span>Upload CV</span>
                                        <input type="file" onChange={(e) => handleFileChange(e, 'cv')} />
                                        {formData.cv ? <span className="file-status success">✓ Selected</span> : <span className="file-status">No file chosen</span>}
                                    </label>
                                </div>
                            </div>

                            <div className="education-section">
                                <h3 className="section-title">Education</h3>
                                <div className="edu-inputs">
                                    <input
                                        type="text"
                                        name="institution"
                                        placeholder="Institution"
                                        className="form-input"
                                        value={formData.institution}
                                        onChange={handleChange}
                                    />
                                    <div className="year-inputs">
                                        <input
                                            type="text"
                                            name="startyear"
                                            placeholder="Start"
                                            className="form-input"
                                            value={formData.startyear}
                                            onChange={handleChange}
                                        />
                                        <input
                                            type="text"
                                            name="endyear"
                                            placeholder="End"
                                            className="form-input"
                                            value={formData.endyear}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <button type="button" onClick={handleAddEducation} className="btn-secondary add-btn">Add</button>
                                </div>

                                {education.length > 0 && (
                                    <div className="edu-list">
                                        {education.map((edu, idx) => (
                                            <div key={idx} className="edu-item">
                                                <span className="edu-school">{edu.institution}</span>
                                                <span className="edu-years">{edu.startyear} - {edu.endyear || 'Present'}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {userType === 'recruiter' && (
                        <>
                            <div className="form-group">
                                <label>Contact Number <span className="label-hint">(10 digits)</span></label>
                                <input
                                    type="text"
                                    name="contact_number"
                                    className="form-input"
                                    value={formData.contact_number}
                                    onChange={handleChange}
                                    placeholder="1234567890"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Company Bio <span className="label-hint">(max 250 words)</span></label>
                                <textarea
                                    name="bio_recruiter"
                                    className="form-input form-textarea"
                                    value={formData.bio_recruiter}
                                    onChange={handleChange}
                                    rows="4"
                                />
                            </div>
                        </>
                    )}

                    {error && <div className="error-message">{error}</div>}

                    <div className="form-actions">
                        <button type="submit" className="btn-primary full-width" disabled={loading}>
                            {loading ? 'Creating Account...' : 'Register'}
                        </button>
                    </div>

                    <div className="auth-footer">
                        <p>
                            Already have an account? <Link to="/login" className="text-primary link">Login</Link>
                        </p>
                    </div>
                </form>
            </div>

            <style>{`
                .auth-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 90vh; /* More breathing room */
                    padding: 4rem 1rem;
                }
                .auth-card {
                    width: 100%;
                    max-width: 450px;
                    padding: 2.5rem;
                    border-radius: var(--radius-xl);
                    margin: 0 auto;
                }
                .registration-card {
                    max-width: 650px; /* Wider for registration options */
                }
                .auth-header {
                    text-align: center;
                    margin-bottom: 2rem;
                }
                .auth-title {
                    font-size: 2rem;
                    font-weight: 700;
                    color: var(--text-main);
                    margin: 0 0 0.5rem 0;
                }
                .auth-subtitle {
                    color: var(--text-secondary);
                    font-size: 1rem;
                    margin: 0;
                }
                .tab-group {
                    display: flex;
                    justify-content: center;
                    margin-bottom: 2rem;
                    background: var(--bg-app);
                    padding: 0.35rem;
                    border-radius: var(--radius-md);
                    border: 1px solid var(--border);
                }
                .tab-btn {
                    flex: 1;
                    padding: 0.6rem;
                    border: none;
                    background: transparent;
                    color: var(--text-secondary);
                    font-weight: 500;
                    border-radius: calc(var(--radius-md) - 2px);
                    cursor: pointer;
                    transition: all 0.2s;
                    font-family: var(--font-sans);
                    font-size: 0.95rem;
                }
                .tab-btn:hover {
                    color: var(--text-main);
                }
                .tab-btn.active {
                    background: white;
                    color: var(--primary);
                    font-weight: 600;
                    box-shadow: var(--shadow-sm);
                }
                .auth-form {
                    display: flex;
                    flex-direction: column;
                    gap: 1.25rem;
                }
                .form-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1rem;
                }
                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 0.4rem;
                }
                .form-group label {
                    font-size: 0.9rem;
                    font-weight: 600;
                    color: var(--text-main);
                }
                .label-hint {
                    font-weight: 400;
                    color: var(--text-tertiary);
                    font-size: 0.85rem;
                }
                .form-input {
                    display: block;
                    width: 100%;
                    padding: 0.75rem 1rem;
                    border: 1px solid var(--border);
                    border-radius: var(--radius-md);
                    font-family: var(--font-sans);
                    font-size: 0.95rem;
                    color: var(--text-main);
                    background: var(--bg-surface);
                    transition: border-color 0.2s, box-shadow 0.2s;
                }
                .form-input:focus {
                    outline: none;
                    border-color: var(--primary);
                    box-shadow: 0 0 0 3px var(--primary-light);
                }
                .password-input-wrapper {
                    position: relative;
                }
                .password-toggle {
                    position: absolute;
                    right: 0.75rem;
                    top: 50%;
                    transform: translateY(-50%);
                    background: none;
                    border: none;
                    color: var(--text-tertiary);
                    font-size: 0.8rem;
                    font-weight: 600;
                    cursor: pointer;
                    padding: 0.25rem 0.5rem;
                    border-radius: 4px;
                }
                .password-toggle:hover {
                    color: var(--text-main);
                    background-color: var(--bg-app);
                }
                .file-upload-label {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 1rem;
                    border: 1px dashed var(--border);
                    border-radius: var(--radius-md);
                    cursor: pointer;
                    background: var(--bg-input);
                    transition: all 0.2s;
                    text-align: center;
                }
                .file-upload-label:hover {
                    border-color: var(--primary);
                    background: var(--primary-light);
                }
                .file-upload-label span:first-child {
                    font-weight: 500;
                    color: var(--text-secondary);
                    margin-bottom: 0.25rem;
                }
                .file-upload-label input {
                    display: none;
                }
                .file-status {
                    font-size: 0.8rem;
                    color: var(--text-tertiary);
                }
                .file-status.success {
                    color: var(--secondary);
                }
                .education-section {
                    background: var(--bg-app);
                    padding: 1.25rem;
                    border-radius: var(--radius-md);
                    border: 1px solid var(--border);
                }
                .section-title {
                    font-size: 1rem;
                    font-weight: 600;
                    margin: 0 0 1rem 0;
                    color: var(--text-main);
                }
                .edu-inputs {
                    display: grid;
                    grid-template-columns: 2fr 1.5fr auto;
                    gap: 0.75rem;
                    align-items: start;
                }
                .year-inputs {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 0.5rem;
                }
                .btn-secondary {
                    background-color: white;
                    color: var(--text-main);
                    border: 1px solid var(--border);
                    border-radius: var(--radius-md);
                    padding: 0.75rem 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .btn-secondary:hover {
                    background-color: var(--bg-app);
                    border-color: var(--text-tertiary);
                }
                .add-btn {
                    padding: 0.75rem 1.25rem;
                    height: 42px; /* Accessibly sized target matches input height approx */
                }
                .edu-list {
                    margin-top: 1rem;
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }
                .edu-item {
                    display: flex;
                    justify-content: space-between;
                    background: white;
                    padding: 0.5rem 0.75rem;
                    border-radius: var(--radius-md);
                    border: 1px solid var(--border);
                    font-size: 0.9rem;
                }
                .edu-school {
                    font-weight: 500;
                }
                .edu-years {
                    color: var(--text-secondary);
                }
                .form-textarea {
                    resize: vertical;
                    min-height: 100px;
                }
                .form-actions {
                    margin-top: 1rem;
                }
                .full-width {
                    width: 100%;
                }
                .error-message {
                    background-color: #FEF2F2;
                    color: var(--danger);
                    padding: 0.75rem;
                    border-radius: var(--radius-md);
                    border: 1px solid #FECACA;
                    font-size: 0.9rem;
                    text-align: center;
                }
                .auth-footer {
                    text-align: center;
                    font-size: 0.95rem;
                    color: var(--text-secondary);
                    margin-top: 1rem;
                    padding-top: 1rem;
                    border-top: 1px solid var(--border);
                }
                .link {
                    font-weight: 600;
                    text-decoration: none;
                    color: var(--primary);
                }
                .link:hover {
                    text-decoration: underline;
                }

                @media (max-width: 600px) {
                    .form-row, .edu-inputs {
                        grid-template-columns: 1fr;
                    }
                    .year-inputs {
                        grid-template-columns: 1fr 1fr;
                    }
                    .add-btn {
                        width: 100%;
                    }
                }
            `}</style>
        </div>
    );
};

export default Register;
