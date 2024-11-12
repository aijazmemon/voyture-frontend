import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Profile.css';

const Profile = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/api/profile/${id}`);
        setProfile(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Error fetching profile');
      }
    };

    fetchProfile();
  }, [id]);

  const handleBackClick = () => {
    navigate('/');
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="profile-parent">
      <div className="profile-container">
        <button className="back-button" onClick={handleBackClick}>
          Back
        </button>

        {profile ? (
          <div>
            <div className="profile-header">
              <h1>{profile.fullName}'s Profile</h1>
            </div>
            <div className="profile-content">
              <div className="profile-details">
                <p>Email: {profile.email}</p>
                <p>Phone: {profile.phone}</p>
                <p>Status: {profile.isHost ? "Host" : "User"}</p>
                {profile.isHost && <p>Profession: {profile.profession}</p>}
              </div>
              <div className="profile-selfie-container">
                {profile.selfie && (
                  <img className="profile-selfie" src={profile.selfie} alt="Profile" />
                )}
              </div>
            </div>
          </div>
        ) : (
          <p className="loading-message">Loading profile...</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
