import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './HostExperienceDetails.css';

const apiBaseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const HostExperienceDetails = () => {
  const { HostexperienceId } = useParams();
  const [experience, setExperience] = useState(null);
  const [bookingsCount, setBookingsCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch experience details and booking count
    const fetchExperienceDetails = async () => {
      try {
        const authToken = localStorage.getItem('authToken');
        const response = await axios.get(`${apiBaseUrl}/api/host-experience-details/${HostexperienceId}`, {
            headers: { Authorization: `Bearer ${authToken}` },
          });
          
        setExperience(response.data.experience);
        setBookingsCount(response.data.bookingsCount);
      } catch (error) {
        console.error('Error fetching experience details:', error);
      }
    };

    fetchExperienceDetails();
  }, [HostexperienceId]);

  const handleBackClick = () => {
    navigate('/');
  };

  const deleteExperience = async () => {
    const confirmation = window.confirm("Are you sure you want to delete this experience?");
    
    if (!confirmation) return; // Exit if the user cancels
  
    try {
      const authToken = localStorage.getItem('authToken');
      await axios.delete(`${apiBaseUrl}/api/host-experience-details/${HostexperienceId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      navigate('/your-posted-experiences'); // Redirect back to experiences list
    } catch (error) {
      console.error('Error deleting experience:', error);
    }
  };
  

  if (!experience) return <div>Loading experience details...</div>;

  return (
    <div className='HostExperience-parent' style={{ backgroundColor: '#fcdeca', minHeight: '100vh' }}>
    <div className='container'>
        <button className='back-btn' onClick={handleBackClick} style={{ position: 'absolute', top: '10px', left: '10px' }}>
            Back
        </button>
      <h1 className='host-heading'>{experience.title}</h1>
      <p>{experience.description}</p>
      <p className='location'>Location: {experience.city}, {experience.state}</p>
     {/* <p className='available-dates'>Available Dates: {experience.availableDates.join(', ')}</p> */}
      <p className='bookings-count'>Number of Bookings: {bookingsCount}</p>
      <button className='delete-button' onClick={deleteExperience}>Delete Experience</button>
    </div>
    </div>
  );
};

export default HostExperienceDetails;
