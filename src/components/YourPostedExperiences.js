import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const apiBaseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
import './YourPostedExperiences.css';

const YourPostedExperiences = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('No token found');
        
        const response = await axios.get(`${apiBaseUrl}/api/your-posted-experiences`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setExperiences(response.data);
      } catch (err) {
        setError('Failed to load experiences.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  const handleBackClick = () => {
    navigate('/');
  };

  // Handle experience click to navigate to details page
  const handleExperienceClick = (experienceId) => {
    navigate(`/host-experience-details/${experienceId}`);
  };

  if (loading) return <div>Loading your experiences...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className='your-posted-experiences-parent' style={{ backgroundColor: '#fcdeca', minHeight: '100vh' }}>
      <div className="your-posted-experiences">
        <button className="back-btn" onClick={handleBackClick} style={{ position: 'absolute', top: '10px', left: '10px' }}>
          Back
        </button>
        <h1>Your Posted Experiences</h1>
        {experiences.length === 0 ? (
          <p>You haven't posted any experiences yet.</p>
        ) : (
          <div className="experience-list">
            {experiences.map((experience) => {
              // Check if experience.image is an array, and if so, take the first image
              const imageUrl = Array.isArray(experience.images) ? experience.images[0] : experience.images;

              return (
                <div key={experience._id} className="experience-card" onClick={() => handleExperienceClick(experience._id)}>
                  <img src={`${apiBaseUrl}/${imageUrl}`} alt={experience.title} />
                  <h2>{experience.title}</h2>
                  <p><strong>Location:</strong> {experience.state}, {experience.country}</p>
                  <p><strong>Price:</strong> ${experience.price}</p>
                  {/* <p>
                    <strong>Available Dates:</strong> {Array.isArray(experience.availableDates) && experience.availableDates.length > 0
                      ? experience.availableDates.map(date => {
                          const parsedDate = new Date(date);
                          return !isNaN(parsedDate) ? parsedDate.toLocaleDateString() : "Invalid Date";
                        }).join(", ")
                      : "No dates available"}
                  </p> */}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default YourPostedExperiences;
