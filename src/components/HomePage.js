import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './HomePage.css';
import logo from '../assets/Voyture.png';
import image1 from '../assets/image1.jpg';
import image2 from '../assets/image2.jpg';
import image3 from '../assets/image3.jpg';
import experience1 from '../assets/experience1.jpg';
import experience2 from '../assets/experience2.jpg';
import experience3 from '../assets/experience3.jpg';
import { FaPlane, FaHotel, FaListAlt, FaUser, FaPlusCircle } from 'react-icons/fa';
import { useAuth } from '../App';

const HomePage = () => {
  const { user, setUser } = useAuth();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('authToken'));
  const [isHost, setIsHost] = useState(false);
  const navigate = useNavigate();
  const [currentImage, setCurrentImage] = useState(0);

  const bannerImages = [image1, image2, image3];
  const experiences = [
    { id: 1, title: "Cultural Tour", description: "Explore local traditions and heritage", image: experience1 },
    { id: 2, title: "Mountain Adventure", description: "Join a thrilling mountain adventure", image: experience2 },
    { id: 3, title: "City Market Tour", description: "Discover unique products at the city market", image: experience3 },
  ];

  useEffect(() => {
    if (user && user.isHost) {
      setIsHost(true);
    }
  }, [user]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % bannerImages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [bannerImages.length]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUser(null);
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <div className='home-parent' style={{ backgroundColor: '#fcdeca', minHeight: '100vh' }}>
    <div className="home-container">
      <nav className="navbar">
        <Link to="/">
          <img src={logo} alt="Voyture Logo" className="logo" />
        </Link>
        {isLoggedIn && (
          <Link to={`/profile/${user._id}`} className="nav-item">
            <FaUser /> Profile
          </Link>
        )}
        {isHost ? (
          <>
            <Link to="/experiences" className="nav-item">
              <FaListAlt /> Experiences
            </Link>
            <Link to="/post-experience" className="nav-item">
              <FaPlusCircle /> Post an Experience
            </Link>
            <Link to="/your-posted-experiences" className="nav-item">
              Your Posted Experiences
            </Link>
          </>
        ) : (
          <>
            <Link to="/experiences" className="nav-item">
              <FaListAlt /> Experiences
            </Link>
            <Link to="/hotels" className="nav-item">
              <FaHotel /> Hotels
            </Link>
            <Link to="/flights" className="nav-item">
              <FaPlane /> Flights
            </Link>
            <Link to="/manage-booking" className="nav-item">
              <FaListAlt /> Manage Bookings
            </Link>
          </>
        )}
        {isLoggedIn ? (
          <button id='logout-btn' onClick={handleLogout} className="nav-item">
            Logout
          </button>
        ) : (
          <Link to="/" className="nav-item">
            Login/Signup
          </Link>
        )}
      </nav>

      
      <div className="home-container">
        <div className='main-content'>
        <div className="welcome-banner">
          <h1 className="welcome-message">
            Welcome to <img src={logo} alt="Voyture Logo" className="logo-inline" />
          </h1>
         <p className="tagline">Journey into Authenticity</p>
        </div>
        <div className="sliding-banner">
          <img src={bannerImages[currentImage]} alt="Banner Slide" className="banner-image" />
        </div>
        </div>

        {/* Experiences Section */}
        <div className="experiences-section">
          <h2>Explore Exciting Experiences</h2>
          <div className="experience-list">
            {experiences.map((experience) => (
              <div key={experience.id} className="experience-card">
                <img src={experience.image} alt={experience.title} className="experience-image-homepage" />
                <h3 className="card-title">{experience.title}</h3>
                <p className="experience-description">{experience.description}</p>
              </div>
            ))}
          </div>
          <Link to="/experiences" className="see-more-button">See More</Link>
        </div>
      </div>
      </div>
    </div>
  );
};

export default HomePage;
