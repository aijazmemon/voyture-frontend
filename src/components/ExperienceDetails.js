import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
const apiBaseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
import './ExperienceDetails.css';

const ExperienceDetails = () => {
    const { experienceId } = useParams();
    const [experience, setExperience] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchExperience = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${apiBaseUrl}/api/experiences/${experienceId}`);
                setExperience(response.data.experience);
            } catch (err) {
                console.error("Error fetching experience details:", err);
                setError('Failed to fetch experience details.');
            } finally {
                setLoading(false);
            }
        };

        fetchExperience();
    }, [experienceId]);

    const handleBackClick = () => {
        navigate('/experiences');
    };

    const handleBooking = () => {
        navigate(`/book/${experienceId}`, { state: { experience } });
    };

    if (loading) return <p>Loading experience details...</p>;
    if (error) return <p>{error}</p>;
    if (!experience) return <p>No experience found.</p>;

    return (
        <div className='experience-details-parent' style={{ backgroundColor: '#fff5ee', minHeight: '100vh' }}>
            <div className='experience-details-container'>
                <button className='back-btn' onClick={handleBackClick} style={{ position: 'absolute', top: '10px', left: '10px' }}>
                    Back
                </button>
                <h2 className='experience-title'>{experience.title}</h2>

                {/* Image gallery */}
                <div className='image-gallery'>
                    {experience.images.map((image, index) => (
                        <img
                            key={index}
                            src={`${apiBaseUrl}/${image}`}
                            alt={`Experience ${index + 1}`}
                            className='experience-image'
                        />
                    ))}
                </div>

                <p className='experience-description'>{experience.description}</p>
                <p className='experience-location'>Location: {experience.city}, {experience.country}</p>
                <p className='experience-price'>Price: ${experience.price}</p>
                <button className='book-btn' onClick={handleBooking} disabled={loading}>Book Now</button>
            </div>
        </div>
    );
};

export default ExperienceDetails;
