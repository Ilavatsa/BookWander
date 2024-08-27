import React, { useState } from 'react';
import './UserProfile.css';

const UserProfile = () => {
    const [profile, setProfile] = useState({
        name: 'John Doe',
        phone: '123-456-7890',
        email: 'johndoe@example.com',
        role: 'passenger',
        photo: null
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile({ ...profile, [name]: value });
    };

    const handleFieldClick = (e) => {
        e.target.removeAttribute('readonly');
        e.target.focus();
    };

    const handleFieldBlur = (e) => {
        e.target.setAttribute('readonly', true);
        console.log('Profile updated:', profile);
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setProfile({ ...profile, photo: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="profile-container">
            <div className="profile-header">
                <div className="profile-photo">
                    {profile.photo ? (
                        <img src={profile.photo} alt="Profile" />
                    ) : (
                        <span>P</span>
                    )}
                </div>
                <h2>Profile</h2>
                <input 
                    type="file" 
                    id="photoUpload" 
                    accept="image/*" 
                    onChange={handlePhotoChange} 
                    style={{ display: 'none' }}
                />
                <button
                    className="edit-photo-button"
                    onClick={() => document.getElementById('photoUpload').click()}
                >
                    Edit Profile Photo
                </button>
            </div>
            <div className="profile-details">
                <form>
                    <label>
                        Name:
                        <input
                            type="text"
                            name="name"
                            value={profile.name}
                            onChange={handleChange}
                            readOnly
                            onClick={handleFieldClick}
                            onBlur={handleFieldBlur}
                        />
                    </label>
                    <label>
                        Phone:
                        <input
                            type="text"
                            name="phone"
                            value={profile.phone}
                            onChange={handleChange}
                            readOnly
                            onClick={handleFieldClick}
                            onBlur={handleFieldBlur}
                        />
                    </label>
                    <label>
                        Email:
                        <input
                            type="email"
                            name="email"
                            value={profile.email}
                            onChange={handleChange}
                            readOnly
                            onClick={handleFieldClick}
                            onBlur={handleFieldBlur}
                        />
                    </label>
                    <label>
                        Role:
                        <select
                            name="role"
                            value={profile.role}
                            onChange={handleChange}
                            
                            onClick={handleFieldClick}
                            onBlur={handleFieldBlur}
                        >
                            <option value="passenger">Passenger</option>
                            <option value="operator">Operator</option>
                        </select>
                    </label>
                </form>
            </div>
        </div>
    );
};

export default UserProfile;
