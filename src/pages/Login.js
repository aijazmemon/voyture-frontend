import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import './LoginSignup.css';

const apiBaseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Login = () => {
  const [loginMethod, setLoginMethod] = useState('email');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loginAs, setLoginAs] = useState('user');
  const { setUser } = useAuth();
  const navigate = useNavigate();

  // Text Looping State
  const phrases = ["Discover. Connect. Thrive.", "Voyture.com"];
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);

  // Update the current phrase every 4 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentPhraseIndex((prevIndex) => (prevIndex + 1) % phrases.length);
    }, 4000);

    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, [phrases.length]);


  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = {
      emailOrPhone: loginMethod === 'email' ? event.target.email.value : event.target.phone.value,
      password: event.target.password.value,
    };

    try {
      const response = await axios.post(`${apiBaseUrl}/api/auth/login`, formData);
      const { token, user } = response.data;

      localStorage.setItem('authToken', token);
      setUser(user);

      navigate('/home');
    } catch (error) {
      setError('Login failed. Please check your credentials.');
      console.error('Error during login:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='login-parent'>
    <div className="header-container">
      <div className="login-branding">
        <h1>
          <span id="animated-text">{phrases[currentPhraseIndex]}</span>
        </h1>
      </div>


      <div className="branding-divider"></div>

      <div className="login-box">
        <div className="login-container">
          <h2>Login as:</h2>
          <div className="user-host-toggle">
            <button
              onClick={() => setLoginAs('user')}
              className={loginAs === 'user' ? 'active' : ''}
            >
              User
            </button>
            <button
              onClick={() => setLoginAs('host')}
              className={loginAs === 'host' ? 'active' : ''}
            >
              Host
            </button>
          </div>

          <div className="login-method-toggle">
            <button onClick={() => setLoginMethod('email')} className={loginMethod === 'email' ? 'active' : ''}>
              Login with Email
            </button>
            <button onClick={() => setLoginMethod('phone')} className={loginMethod === 'phone' ? 'active' : ''}>
              Login with Phone
            </button>
          </div>

          {error && <p className="error-message">{error}</p>}

          <form onSubmit={handleSubmit}>
            {loginMethod === 'email' ? (
              <input name="email" type="email" placeholder="Email" required />
            ) : (
              <input name="phone" type="text" placeholder="Phone Number" required />
            )}
            <input name="password" type="password" placeholder="Password" required />

            <button className="submit-btn" type="submit" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="signup-link">
            <p>
              Don't have an account?{' '}
              <button className='link-btn' onClick={() => navigate('/signup')}>Signup</button>
            </p>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Login;
