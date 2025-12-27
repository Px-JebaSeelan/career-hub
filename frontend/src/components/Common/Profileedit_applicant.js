import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../../api_config';
import { useHistory } from "react-router-dom";

const ProfileEditApplicant = () => {
    const history = useHistory();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        list_of_languages: '', // Legacy
        skills: [],
        education: [],
        image: null,
        cv: null
    });

    // Education Input State
    const [newEdu, setNewEdu] = useState({
        institution: '',
        startyear: '',
        endyear: ''
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        const userEmail = localStorage.getItem("user_email");
        if (!userEmail) {
            history.push("/login");
            return;
        }

        const fetchProfile = async () => {
            try {
                const res = await axios.post(API_URL + '/applicant/get_an_applicant_by_email', { "applicant_ka_email": userEmail });
                const user = res.data;
                setFormData({
                    name: user.name || '',
                    email: user.email || '',
                    list_of_languages: user.list_of_languages || '',
                    skills: user.skills || [], // Load skills from backend
                    education: user.education || [],
                    image: null,
                    cv: null
                });

                if (user.image && user.image !== 'undefined') {
                    // If image exists, construct preview URL if it were a real file path or base64
                    // Assuming user.image is a filename stored on server
                    // But legacy code did <img src={API_URL + '/image/' + localStorage.getItem('user_image')}
                    // Let's try to show the existing image
                    setImagePreview(API_URL + '/image/' + localStorage.getItem('user_image'));
                }

                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchProfile();
    }, [history]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const addSkill = (skill) => {
        if (skill && !formData.skills.includes(skill)) {
            setFormData({
                ...formData,
                skills: [...formData.skills, skill]
            });
        }
    };

    const removeSkill = (index) => {
        const newSkills = [...formData.skills];
        newSkills.splice(index, 1);
        setFormData({ ...formData, skills: newSkills });
    };

    const handleEduChange = (e) => {
        setNewEdu({ ...newEdu, [e.target.name]: e.target.value });
    };

    const addEducation = () => {
        if (!newEdu.institution || !newEdu.startyear) {
            alert("Institution and Start Year are required");
            return;
        }
        setFormData({
            ...formData,
            education: [...formData.education, newEdu]
        });
        setNewEdu({ institution: '', startyear: '', endyear: '' });
    };

    const removeEducation = (index) => {
        const updatedEdu = [...formData.education];
        updatedEdu.splice(index, 1);
        setFormData({ ...formData, education: updatedEdu });
    };

    const handleFileChange = (e, type) => {
        const file = e.target.files[0];
        if (file) {
            if (type === 'image') {
                setImagePreview(URL.createObjectURL(file));
            }
            // Upload immediately as per original logic or store to upload on submit?
            // Original code uploaded immediately on change. Let's keep that but cleanly.
            const data = new FormData();
            data.append('file', file);

            axios.post(API_URL + `/applicant/addfile?type=${type}&email=${formData.email}`, data)
                .then(res => {
                    console.log(`${type} uploaded`, res.data);

                    if (type === 'cv') {
                        alert("CV uploaded successfully.");
                    } else if (type === 'image') {
                        // Image preview is handled by state, just confirm upload
                    }
                })
                .catch(err => {
                    console.error(err);
                    alert("Upload failed.");
                });
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        const updateData = {
            ...formData,
            email: localStorage.getItem("user_email")
        };

        try {
            await axios.post(API_URL + '/applicant/edit_applicant_profile', updateData);
            await axios.post(API_URL + '/user/updateuser', {
                name: formData.name,
                email: updateData.email
            });
            localStorage.setItem('user_name', formData.name);
            alert("Profile Updated Successfully!");
        } catch (err) {
            console.error(err);
            alert("Error updating profile.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="text-center p-5">Loading...</div>;

    return (
        <div className="profile-container">
            <div className="glass profile-card">
                <div className="profile-header-section">
                    <div className="avatar-wrapper">
                        {imagePreview ? (
                            <img src={imagePreview} alt="Profile" className="profile-avatar" />
                        ) : (
                            <div className="profile-avatar-placeholder">{formData.name.charAt(0)}</div>
                        )}
                        <label className="avatar-upload-btn">
                            Edit
                            <input type="file" onChange={(e) => handleFileChange(e, 'image')} accept="image/*" />
                        </label>
                    </div>

                    <h1 className="profile-title">{formData.name}</h1>
                    <p className="profile-email">{formData.email}</p>
                </div>

                <form onSubmit={onSubmit} className="profile-form">
                    <div className="section-block">
                        <h3 className="section-title">Personal Details</h3>
                        <div className="form-group">
                            <label>Full Name</label>
                            <input
                                type="text"
                                name="name"
                                className="form-input"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Skills <span className="helper-text">(Add your skills)</span></label>
                            <div className="skills-input-container">
                                <div className="skills-list">
                                    {formData.skills && formData.skills.map((skill, index) => (
                                        <span key={index} className="skill-chip">
                                            {skill}
                                            <button type="button" onClick={() => removeSkill(index)} className="skill-remove">×</button>
                                        </span>
                                    ))}
                                </div>
                                <div className="skill-add-row">
                                    <input
                                        type="text"
                                        placeholder="Add a skill..."
                                        className="form-input skill-input-field"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                addSkill(e.target.value);
                                                e.target.value = '';
                                            }
                                        }}
                                    />
                                    <span className="helper-text-small">Press Enter to add</span>
                                </div>
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Update CV/Resume</label>
                            <div className="file-input-wrapper">
                                <input type="file" onChange={(e) => handleFileChange(e, 'cv')} className="form-input" />
                            </div>
                        </div>
                    </div>

                    <div className="section-block">
                        <h3 className="section-title">Education</h3>
                        <div className="edu-add-row">
                            <input
                                type="text"
                                name="institution"
                                placeholder="Institution/College"
                                className="form-input flex-2"
                                value={newEdu.institution}
                                onChange={handleEduChange}
                            />
                            <div className="year-inputs flex-1">
                                <input
                                    type="text"
                                    name="startyear"
                                    placeholder="Start"
                                    className="form-input"
                                    value={newEdu.startyear}
                                    onChange={handleEduChange}
                                />
                                <input
                                    type="text"
                                    name="endyear"
                                    placeholder="End"
                                    className="form-input"
                                    value={newEdu.endyear}
                                    onChange={handleEduChange}
                                />
                            </div>
                            <button type="button" onClick={addEducation} className="btn-secondary add-btn">Add</button>
                        </div>

                        <div className="edu-list">
                            {formData.education.map((edu, idx) => (
                                <div key={idx} className="edu-item">
                                    <div className="edu-info">
                                        <div className="edu-school">{edu.institution}</div>
                                        <div className="edu-years">{edu.startyear} - {edu.endyear || 'Present'}</div>
                                    </div>
                                    <button type="button" onClick={() => removeEducation(idx)} className="delete-icon-btn">×</button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn-primary full-width" disabled={saving}>
                            {saving ? 'Saving...' : 'Save Changes'}
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
                    max-width: 700px;
                    padding: 2.5rem;
                    border-radius: var(--radius-xl);
                }
                .profile-header-section {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    margin-bottom: 2.5rem;
                    text-align: center;
                }
                .avatar-wrapper {
                    position: relative;
                    margin-bottom: 1rem;
                }
                .profile-avatar {
                    width: 100px;
                    height: 100px;
                    border-radius: 50%;
                    object-fit: cover;
                    border: 3px solid white;
                    box-shadow: var(--shadow-md);
                }
                .profile-avatar-placeholder {
                    width: 100px;
                    height: 100px;
                    border-radius: 50%;
                    background: var(--primary-light);
                    color: var(--primary);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 2.5rem;
                    font-weight: 700;
                    border: 3px solid white;
                    box-shadow: var(--shadow-md);
                }
                .avatar-upload-btn {
                    position: absolute;
                    bottom: 0;
                    right: 0;
                    background: var(--primary);
                    color: white;
                    font-size: 0.7rem;
                    padding: 0.25rem 0.5rem;
                    border-radius: 12px;
                    cursor: pointer;
                    box-shadow: var(--shadow-sm);
                }
                .avatar-upload-btn input {
                    display: none;
                }
                .profile-title {
                    font-size: 1.75rem;
                    margin: 0;
                }
                .profile-email {
                    color: var(--text-secondary);
                    margin: 0.25rem 0 0;
                }
                .section-block {
                    margin-bottom: 2rem;
                    background: rgba(255,255,255,0.5);
                    padding: 1.5rem;
                    border-radius: var(--radius-lg);
                    border: 1px solid var(--border-glass);
                }
                .section-title {
                    font-size: 1.1rem;
                    margin-bottom: 1rem;
                    color: var(--primary);
                    border-bottom: 1px solid var(--border);
                    padding-bottom: 0.5rem;
                }
                .edu-add-row {
                    display: grid;
                    grid-template-columns: 2fr 1.5fr auto;
                    gap: 0.75rem;
                    margin-bottom: 1rem;
                }
                .year-inputs {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 0.5rem;
                }
                .edu-list {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }
                .edu-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background: white;
                    padding: 0.75rem;
                    border-radius: var(--radius-md);
                    border: 1px solid var(--border);
                }
                .edu-school {
                    font-weight: 600;
                    font-size: 0.95rem;
                }
                .edu-years {
                    font-size: 0.85rem;
                    color: var(--text-secondary);
                }
                .delete-icon-btn {
                    background: none;
                    border: none;
                    color: var(--text-tertiary);
                    font-size: 1.25rem;
                    cursor: pointer;
                    line-height: 1;
                    padding: 0 0.5rem;
                }
                .delete-icon-btn:hover {
                    color: var(--danger);
                }
                .add-btn {
                    height: 42px;
                }
                @media (max-width: 600px) {
                    .edu-add-row {
                        grid-template-columns: 1fr;
                    }
                }

                /* Skills Chips */
                .skills-input-container {
                    background: white;
                    border: 1px solid var(--border);
                    border-radius: var(--radius-md);
                    padding: 0.5rem;
                }
                .skills-list {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.5rem;
                    margin-bottom: 0.5rem;
                }
                .skill-chip {
                    background: var(--primary-light);
                    color: var(--primary);
                    padding: 0.25rem 0.6rem;
                    border-radius: 16px;
                    font-size: 0.85rem;
                    font-weight: 500;
                    display: flex;
                    align-items: center;
                    gap: 0.3rem;
                }
                .skill-remove {
                    background: none;
                    border: none;
                    color: var(--primary);
                    cursor: pointer;
                    font-weight: 700;
                    line-height: 1;
                    padding: 0;
                    font-size: 1rem;
                }
                .skill-remove:hover {
                    color: var(--danger);
                }
                .skill-input-field {
                    border: none;
                    box-shadow: none;
                    padding: 0.25rem 0.5rem;
                    background: transparent;
                }
                .skill-input-field:focus {
                    box-shadow: none;
                }
                .helper-text-small {
                    font-size: 0.75rem;
                    color: var(--text-tertiary);
                    margin-left: 0.5rem;
                }
            `}</style>
        </div>
    );
};

export default ProfileEditApplicant;