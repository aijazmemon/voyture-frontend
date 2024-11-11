import React, { createContext, useContext, useState, useEffect } from 'react';
import './App.css';

import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Profile from './components/Profile';
import HomePage from './components/HomePage';
import PostExperience from './components/PostExperience'; 
import YourPostedExperiences from './components/YourPostedExperiences';
import Experiences from './components/Experiences';
import ExperienceDetails from './components/ExperienceDetails';
import ManageBooking from './components/ManageBooking';
import HostExperienceDetails from './components/HostExperienceDetails';
import Hotels from './components/Hotels';
import HotelList from './components/HotelList';
import BookingPage from './components/BookingPage';
import Flights from './components/Flights';

// Create a context for user authentication
const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

const App = () => {
  const [user, setUser] = useState(null); // State to track user authentication

  const storedUser = JSON.parse(localStorage.getItem('user'));
if (storedUser && storedUser._id) {
  setUser(storedUser);
}

  // Rehydrate the user from localStorage when the app first loads
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      // Here, you could verify the token or fetch the user details using the token
      // Assuming the user details are stored in localStorage for simplicity
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (storedUser && storedUser._id) {
        setUser(storedUser);
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={user ? <Navigate to="/home" /> : <Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/" />} />
            <Route path="/profile/:id" element={user ? <Profile /> : <Navigate to="/" />} />
            <Route path="/home" element={user ? <HomePage /> : <Navigate to="/" />} />
            <Route path="/post-experience" element={user ? <PostExperience/> : <Navigate to="/" />}/>
            <Route path="/your-posted-experiences" element={user ? <YourPostedExperiences/> : <Navigate to="/" />}/>
            <Route path="/experiences" element={user ? <Experiences/> : <Navigate to="/" />}/> 
            <Route path="/experiences/:experienceId" element={<ExperienceDetails />} />
            <Route path="/manage-booking" element={<ManageBooking />} />
            <Route path="/host-experience-details/:HostexperienceId" element={<HostExperienceDetails />} />
            <Route path="/hotels" element={user ? <Hotels/> : <Navigate to="/" />}/>
            <Route path="/hotel-list" element={<HotelList />} />
            <Route path="/book/:experienceId" element={<BookingPage />} />
            <Route path="/flights" element={<Flights />} />

          </Routes>
        </div>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
