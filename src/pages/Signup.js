import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // React Router v6 for navigation
import './LoginSignup.css';
const apiBaseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
import { FaPlane, FaHotel, FaSuitcaseRolling, FaTaxi, FaMap, FaUmbrellaBeach } from 'react-icons/fa';


const Signup = () => {
  const [step, setStep] = useState(1); // Track the signup step
  const [isHost, setIsHost] = useState(false); // Toggle between User and Host signup
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    profession: '',
    location: '',
    otp: '',
    aadharCard: '',
    selfie: null, // Handle file upload for selfie
  });

  // Text Looping State
  const brandIcons = [<FaPlane />, <FaHotel />, <FaSuitcaseRolling/>, <FaTaxi/>, <FaMap/>, <FaUmbrellaBeach/>];
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  

  const [userId, setUserId] = useState(null); // Store the returned userId after signup
  const [isLoading, setIsLoading] = useState(false); // Loading state for async requests

  const navigate = useNavigate(); // Use React Router's useNavigate for redirection


  // Update the current phrase every 2 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentPhraseIndex((prevIndex) => (prevIndex + 1) % brandIcons.length);
    }, 2000);

    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, [brandIcons.length]);



  // Handle form input changes
  const handleChange = (e) => {
    if (e.target.name === 'selfie') {
      setFormData({ ...formData, selfie: e.target.files[0] }); // Handle file input for selfie
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleNext = async () => {
    // Validate required fields before sending signup request
    if (!formData.fullName || !formData.email || !formData.phone || !formData.password) {
      alert('Please fill in all required fields.');
      return;
    }

    setIsLoading(true);
    // Send signup API request to send OTP
    try {
      const response = await axios.post(`${apiBaseUrl}/api/auth/signup`, {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        isHost,
        profession: isHost ? formData.profession : undefined,
        location: isHost ? formData.location : undefined,
      });

      alert(response.data.message); // Alert on successful signup
      setUserId(response.data.userId); // Store userId for later OTP verification
      setStep(2); // Move to OTP step
    } catch (error) {
      console.error('Error during signup:', error);
      alert('Error during signup: ' + (error.response?.data?.message || 'An error occurred'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPVerification = async (e) => {
    e.preventDefault();

    // Validate OTP field
    if (!formData.otp) {
      alert('Please enter the OTP.');
      return;
    }

    setIsLoading(true);
    try {
      // Prepare form data for file upload (if host)
      const formDataForHost = new FormData();
      formDataForHost.append('phone', formData.phone);
      formDataForHost.append('otp', formData.otp);
      formDataForHost.append('userId', userId);

      if (isHost) {
        formDataForHost.append('aadharCard', formData.aadharCard);
        formDataForHost.append('selfie', formData.selfie); // Append selfie file for hosts
      }

      const response = await axios.post(`${apiBaseUrl}/api/auth/verify-otp`, formDataForHost);

      // Handle successful OTP verification
      if (response.data.success) {
        alert(response.data.message); // Alert on successful OTP verification
        // Redirect to profile page after successful OTP verification
        navigate('/home');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      alert('Error verifying OTP: ' + (error.response?.data?.message || 'An error occurred'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='signup-parent'>
    <div className='header-container'>
    <div className="signup-branding">
    <h1>  
          <span id="animated-icons">{brandIcons[currentPhraseIndex]}</span>
        </h1>
    </div>
            
      <div className="branding-divider"></div>
      <div className='signup-box'>
    <div className="signup-container">
      <h1 className="heading">{isHost ? 'Host' : 'User'} Signup</h1>

      {/* Toggle between User and Host */}
      <div className="signup-toggle">
        <button onClick={() => setIsHost(false)} className={!isHost ? 'active' : ''}>
          Signup as User
        </button>
        <button onClick={() => setIsHost(true)} className={isHost ? 'active' : ''}>
          Signup as Host
        </button>
      </div>

      <form onSubmit={handleOTPVerification}>
        {step === 1 && (
          <div>
            <input
              name="fullName"
              type="text"
              placeholder="Full Name"
              onChange={handleChange}
              required
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              onChange={handleChange}
              required
            />
            <input
              name="phone"
              type="text"
              placeholder="Phone Number"
              onChange={handleChange}
              required
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              onChange={handleChange}
              required
            />
            <input name="confirmPassword" type="password" placeholder="Re-enter Password" required />
            {isHost && (
              <>
                <input
                  name="profession"
                  type="text"
                  placeholder="Profession"
                  onChange={handleChange}
                  required
                />
                <input
                  name="location"
                  type="text"
                  placeholder="Location"
                  onChange={handleChange}
                  required
                />
              </>
            )}
            <button className='submit-btn' type="button" onClick={handleNext} disabled={isLoading}>
              {isLoading ? 'Loading...' : 'Next'}
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <input
              name="otp"
              type="text"
              placeholder="Enter OTP"
              onChange={handleChange}
              required
            />
            {isHost && (
              <>
                <input
                  name="aadharCard"
                  type="text"
                  placeholder="Aadhar Card Number"
                  onChange={handleChange}
                  required
                />
                <input
                  name="selfie"
                  type="file"
                  onChange={handleChange}
                  required
                />
              </>
            )}
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </div>
        )}
      </form>

      <div className="login-link">
        <p>
          Already have an account?{' '}
          <button className='link-btn' onClick={() => navigate('/')}>Login</button>
        </p>
      </div>

    </div>
    </div>
    </div>
    </div>
  );
};

export default Signup;
