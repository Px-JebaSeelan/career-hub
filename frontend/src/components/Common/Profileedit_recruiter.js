import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../../api_config';
import { useHistory } from "react-router-dom";

const ProfileEditRecruiter = () => {
    const history = useHistory();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        bio: '',
        contact_number: '',
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const userEmail = localStorage.getItem("user_email");
        if (!userEmail) {
            history.push("/login");
            return;
        }

        axios.post(API_URL + '/recruiter/get_a_recruiter_by_email', { "email": userEmail })
            .then(res => {
                const user = res.data;
                setFormData({
                    name: user.name || '',
                    email: user.email || '',
                    bio: user.bio || '',
                    contact_number: user.contact_number || ''
                });
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [history]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        const updateData = {
            ...formData,
            email: localStorage.getItem("user_email") // Ensure email is consistent
        };

        if (formData.contact_number.length !== 10) {
            alert("Contact number must be exactly 10 digits.");
            setSaving(false);
            return;
        }
        if (formData.bio.split(' ').length > 250) {
            alert("Bio must be under 250 words.");
            setSaving(false);
            return;
        }

        try {
            await axios.post(API_URL + '/recruiter/edit_recruiter_profile', updateData);
            await axios.post(API_URL + '/user/updateuser', {
                name: formData.name,
                email: updateData.email
            });

            localStorage.setItem('user_name', formData.name);
            alert("Profile successfully updated!");
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="text-center p-5">Loading profile...</div>;
    }

    return (
        <div className="profile-container">
            <div className="glass profile-card">
                <div className="profile-header">
                    <h1 className="profile-title">Edit Profile</h1>
                    <p className="profile-subtitle">Manage your recruiter details</p>
                </div>

                <form onSubmit={onSubmit} className="profile-form">
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
                            className="form-input disabled"
                            value={formData.email}
                            disabled
                        />
                        <span className="helper-text">Email cannot be changed</span>
                    </div>

                    <div className="form-group">
                        <label>Contact Number</label>
                        <input
                            type="number"
                            name="contact_number"
                            className="form-input"
                            value={formData.contact_number}
                            onChange={handleChange}
                            placeholder="10-digit number"
                        />
                    </div>

                    <div className="form-group">
                        <label>Company Bio <span className="helper-text">(max 250 words)</span></label>
                        <textarea
                            name="bio"
                            className="form-input form-textarea"
                            value={formData.bio}
                            onChange={handleChange}
                            rows="5"
                        />
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn-primary full-width" disabled={saving}>
                            {saving ? 'Saving Changes...' : 'Save Profile'}
                        </button>
                    </div>
                </form>
            </div>

            <style>{`
                .profile-container {
                    display: flex;
                    justify-content: center;
                    padding: 3rem 1rem;
                }
                .profile-card {
                    width: 100%;
                    max-width: 600px;
                    padding: 2.5rem;
                    border-radius: var(--radius-xl);
                }
                .profile-header {
                    text-align: center;
                    margin-bottom: 2rem;
                }
                .profile-title {
                    margin: 0 0 0.5rem 0;
                    font-size: 2rem;
                }
                .profile-subtitle {
                    color: var(--text-secondary);
                    margin: 0;
                }
                .profile-form {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }
                .form-input.disabled {
                    background-color: rgba(0,0,0,0.05);
                    cursor: not-allowed;
                    color: var(--text-secondary);
                }
                .helper-text {
                    font-size: 0.85rem;
                    color: var(--text-tertiary);
                    margin-top: 0.25rem;
                    display: block;
                    font-weight: 400;
                }
                label .helper-text {
                    display: inline;
                    margin-top: 0;
                }
                .form-textarea {
                    resize: vertical;
                }
                .full-width {
                    width: 100%;
                }
            `}</style>
        </div>
    );
};

export default ProfileEditRecruiter;