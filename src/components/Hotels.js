// Hotels.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import hotelBg from '../assets/hotel-bg.jpg';
import "./Hotels.css";


const apiBaseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Hotels = () => {
  const [location, setLocation] = useState("");
  const [checkInDate, setCheckInDate] = useState(new Date());
  const [checkOutDate, setCheckOutDate] = useState(new Date());
  const [travellers, setTravellers] = useState({
    rooms: 1,
    adults: 1,
    children: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchRegionId = async (location) => {
    try {
      const response = await axios.get("https://hotels-com-provider.p.rapidapi.com/v2/regions", {
        params: {
          query: location,
          locale: "en_IN",
          domain: "IN",
        },
        headers: {
          'x-rapidapi-key': '474eb47bedmsh1a244a5fa656434p1b6070jsn312a789698d5',
          'x-rapidapi-host': 'hotels-com-provider.p.rapidapi.com',
        },
      });
  
      const cityResult = response.data.data.find(entry => entry.type === "CITY");
      if (cityResult && cityResult.gaiaId) {
        return cityResult.gaiaId;
      } else {
        console.error("No valid city region found for the specified location.");
        return null;
      }
    } catch (error) {
      console.error("Error fetching region ID:", error.response?.data || error.message);
      throw error;
    }
  };

  const searchHotels = async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedRegionId = await fetchRegionId(location);
      if (!fetchedRegionId) return;

      const response = await axios.get(`${apiBaseUrl}/api/search-hotels`, {
        params: {
          regionId: fetchedRegionId,
          checkInDate: checkInDate.toISOString().split('T')[0],
          checkOutDate: checkOutDate.toISOString().split('T')[0],
          rooms: travellers.rooms,
          adults: travellers.adults,
          children: travellers.children,
        },
      });

      const hotelsData = response.data.propertySearchListings || response.data.properties || [];
      console.log("Hotels Data from API:", hotelsData); 
      navigate("/hotel-list", { state: { hotels: hotelsData } });
    } catch (error) {
      console.error("Error fetching hotels:", error.response?.data || error.message);
      setError("Failed to fetch hotels. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleTravellerChange = (field, value) => {
    setTravellers((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="hotels-parent">
      <img src={hotelBg} alt="Hotel room Bg" className="hotelBg" />
      <button
        className="back-btn"
        onClick={() => navigate("/")}
        style={{ position: "absolute", top: "10px", left: "10px", zIndex: 1 }}
      >
        Back
      </button>
      <div className="hotels">
        <h1>Search Hotels</h1>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Where to?"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <DatePicker
            selected={checkInDate}
            onChange={(date) => setCheckInDate(date)}
            selectsStart
            startDate={checkInDate}
            endDate={checkOutDate}
            placeholderText="Check-in"
          />
          <DatePicker
            selected={checkOutDate}
            onChange={(date) => setCheckOutDate(date)}
            selectsEnd
            startDate={checkInDate}
            endDate={checkOutDate}
            minDate={checkInDate}
            placeholderText="Check-out"
          />
          <div className="traveller-dropdown">
            <button>Travellers</button>
            <div className="traveller-options">
              <label>
                Rooms:
                <input
                  type="number"
                  value={travellers.rooms}
                  onChange={(e) => handleTravellerChange("rooms", parseInt(e.target.value))}
                  min="1"
                />
              </label>
              <label>
                Adults:
                <input
                  type="number"
                  value={travellers.adults}
                  onChange={(e) => handleTravellerChange("adults", parseInt(e.target.value))}
                  min="1"
                />
              </label>
              <label>
                Children:
                <input
                  type="number"
                  value={travellers.children}
                  onChange={(e) => handleTravellerChange("children", parseInt(e.target.value))}
                  min="0"
                />
              </label>
            </div>
          </div>
          <button className="search-btn" onClick={searchHotels} disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </button>
        </div>

        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
};

export default Hotels;
