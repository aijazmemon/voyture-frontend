import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Experiences.css';

const apiBaseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Experiences = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  // Filter states
  const [countries, setCountries] = useState([]); // Default to empty array
  const [states, setStates] = useState([]); // Default to empty array
  const [countryFilter, setCountryFilter] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

  // Fetch experiences
  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/api/experiences`);
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

  // Fetch countries for dropdown
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get('https://countriesnow.space/api/v0.1/countries');
        setCountries(response.data.data); // Access `data` from response
      } catch (err) {
        console.error('Failed to load countries', err);
      }
    };
    fetchCountries();
  }, []);
  
  

  // Fetch states based on the selected country
  useEffect(() => {
    if (countryFilter) {
      const fetchStates = async () => {
        try {
          const response = await axios.post('https://countriesnow.space/api/v0.1/countries/states', {
            country: countries.find((country) => country.iso2 === countryFilter)?.country,
          });
          setStates(response.data.data.states);
        } catch (err) {
          console.error('Failed to load states', err);
        }
      };
      fetchStates();
    } else {
      setStates([]);
    }
  }, [countryFilter, countries]);

  const handleBackClick = () => {
    navigate('/');
  };

  // Handle filtering
  const filteredExperiences = experiences.filter((experience) => {
    const matchesCountry = countryFilter ? experience.country === countryFilter : true;
    const matchesState = stateFilter ? experience.state === stateFilter : true;
    const matchesPrice = 
      (priceRange.min ? experience.price >= priceRange.min : true) &&
      (priceRange.max ? experience.price <= priceRange.max : true);
    return matchesCountry && matchesState && matchesPrice;
  });

  if (loading) return <div>Loading experiences...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className='Experiences-parent' style={{ backgroundColor: '#fff', minHeight: '100vh' }}>
    <div className="experiences">
      {/* Back button */}
      <button className='back-btn' onClick={handleBackClick} style={{ position: 'absolute', top: '10px', left: '10px' }}>
        Back
      </button>
    <div className='filter-container'>
      {/* Filter bar */}
      <div className="filter-bar">
      <select value={countryFilter} onChange={(e) => setCountryFilter(e.target.value)}>
  <option value="">Select Country</option>
  {countries.map((country, index) => (
    <option key={index} value={country.iso2}>{country.country}</option>
  ))}
</select>


<select value={stateFilter} onChange={(e) => setStateFilter(e.target.value)}>
          <option value="">Select State</option>
          {states.map((state, index) => (
            <option key={index} value={state.state_code}>
              {state.name}
            </option>
          ))}
        </select>
        </div>
        <div className='filter-price'>
        <input
          type="number"
          placeholder="Min Price"
          value={priceRange.min}
          onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
        />

        <input
          type="number"
          placeholder="Max Price"
          value={priceRange.max}
          onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
        />
      </div>
      </div>
      <h1>All Experiences</h1>
      {filteredExperiences.length === 0 ? (
        <p>No experiences available at the moment.</p>
      ) : (
        <div className="experience-list">
          {filteredExperiences.map((experience) => (
            
            <div key={experience._id} className="experience-card" onClick={() => navigate(`/experiences/${experience._id}`)}>
            {experience.images && experience.images.length > 0 && (
              <img src={`${apiBaseUrl}/${experience.images[0]}`} alt={experience.title} />
            )}
            <h2>{experience.title}</h2>
            <p><strong>Country:</strong> {experience.country}</p>
            <p><strong>City:</strong> {experience.city}, {experience.state}</p>
            <p><strong>Price:</strong> ${experience.price}</p>
            {/* <p><strong>Available Dates:</strong> {
                Array.isArray(experience.availableDates) && experience.availableDates.length > 0
                  ? experience.availableDates.map(date => {
                      const parsedDate = new Date(date);
                      return !isNaN(parsedDate) ? parsedDate.toLocaleDateString() : "Invalid Date";
                    }).join(", ")
                  : "No dates available"
              }</p> */}
          </div>
          
          ))}
        </div>
      )}
    </div>
    </div>
  );
};

export default Experiences;
