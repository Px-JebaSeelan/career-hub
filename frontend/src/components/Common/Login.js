import React, { useState } from 'react';
import axios from 'axios';
import API_URL from '../../api_config';
import { Link } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const onChangeEmail = (event) => {
        setEmail(event.target.value);
        setError('');
    };

    const onChangePassword = (event) => {
        setPassword(event.target.value);
        setError('');
    };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const onSubmit = (event) => {
        event.preventDefault();
        setLoading(true);
        setError('');

        const userAdd = {
            email: email,
            password: password
        };

        axios.post(API_URL + '/user/login', userAdd)
            .then(res => {
                setLoading(false);

                // Backend now handles password check and returns { token, user } on success
                // or 400/404 error if failed.

                const { token, user } = res.data;

                localStorage.setItem('token', token);
                localStorage.setItem('user_type', user.type);
                localStorage.setItem('user_name', user.name);
                localStorage.setItem('user_id', user._id);
                localStorage.setItem('isloggedin', true);
                localStorage.setItem('user_email', user.email);

                // Set token for future requests
                // Note: On refresh, this needs to be handled in App.js or similar
                axios.defaults.headers.common['x-auth-token'] = token;

                if (user.type === 'applicant') {
                    // Fetch applicant profile image/details logic
                    const temp = { applicant_ka_email: user.email };
                    axios.post(API_URL + '/applicant/get_an_applicant_by_email', temp)
                        .then((resp) => {
                            localStorage.setItem('user_image', resp.data.image);
                            window.location = '/';
                        })
                        .catch(err => {
                            console.log(err);
                            window.location = '/';
                        });
                } else {
                    window.location = '/';
                }
            })
            .catch(err => {
                setLoading(false);
                if (err.response && err.response.data && err.response.data.error) {
                    setError(err.response.data.error);
                } else if (err.response && err.response.data && err.response.data.msg) {
                    setError(err.response.data.msg);
                } else {
                    setError("Login Failed: Server Error");
                }
                console.log(err);
            });
    };

    return (
        <div className="auth-container">
            <div className="glass auth-card">
                <div className="auth-header">
                    <h1 className="auth-title">Welcome Back</h1>
                    <p className="auth-subtitle">Login to your account</p>
                </div>

                <form onSubmit={onSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            className="form-input"
                            value={email}
                            onChange={onChangeEmail}
                            required
                            placeholder="you@example.com"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <div className="password-input-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                className="form-input"
                                value={password}
                                onChange={onChangePassword}
                                required
                                placeholder="Enter your password"
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={toggleShowPassword}
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <div className="form-actions">
                        <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%' }}>
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </div>

                    <div className="auth-footer">
                        <p>
                            Don't have an account? <Link to="/register" className="text-primary link">Sign Is Up</Link>
                        </p>
                    </div>
                </form>
            </div>

            <style>{`
                .auth-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 80vh;
                    padding: 2rem;
                }
                .auth-card {
                    width: 100%;
                    max-width: 450px;
                    padding: 2.5rem;
                    border-radius: var(--radius-xl);
                }
                .auth-header {
                    text-align: center;
                    margin-bottom: 2rem;
                }
                .auth-title {
                    font-size: 2rem;
                    font-weight: 700;
                    color: var(--text-main);
                    margin-bottom: 0.5rem;
                }
                .auth-subtitle {
                    color: var(--text-secondary);
                    font-size: 1rem;
                }
                .auth-form {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }
                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }
                .form-group label {
                    font-size: 0.9rem;
                    font-weight: 500;
                    color: var(--text-main);
                }
                .form-input {
                    width: 100%;
                    padding: 0.75rem 1rem;
                    border: 1px solid var(--border);
                    border-radius: var(--radius-md);
                    font-family: var(--font-sans);
                    font-size: 1rem;
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
                    right: 1rem;
                    top: 50%;
                    transform: translateY(-50%);
                    background: none;
                    border: none;
                    color: var(--text-secondary);
                    font-size: 0.85rem;
                    font-weight: 500;
                    cursor: pointer;
                }
                .password-toggle:hover {
                    color: var(--text-main);
                }
                .error-message {
                    color: var(--danger);
                    font-size: 0.9rem;
                    text-align: center;
                    padding: 0.5rem;
                    background-color: #FEF2F2;
                    border-radius: var(--radius-md);
                    border: 1px solid #FECACA;
                }
                .auth-footer {
                    text-align: center;
                    margin-top: 1rem;
                    font-size: 0.95rem;
                    color: var(--text-secondary);
                }
                .link {
                    font-weight: 600;
                    text-decoration: none;
                }
                .link:hover {
                    text-decoration: underline;
                }
            `}</style>
        </div>
    );
};

export default Login;