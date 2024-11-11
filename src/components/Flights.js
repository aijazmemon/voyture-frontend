// Flights.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import flightBg from '../assets/flights-bg.png';
import "./Flights.css";

const Flights = () => {
  const [departure, setDeparture] = useState("");
  const [destination, setDestination] = useState("");
  const [departureDate, setDepartureDate] = useState(new Date());
  const [returnDate, setReturnDate] = useState(new Date());
  const [travellers, setTravellers] = useState(1);
  const [flightClass, setFlightClass] = useState("Economy");
  const navigate = useNavigate();

  const searchFlights = () => {
    // Implement flight search API integration here
    console.log("Searching flights...");
    navigate("/flight-results", { state: { /* Pass flight data here */ } });
  };

  return (
    <div className="flights-container-parent">
        <img src={flightBg} alt="Flight Bg" className="flightBg" />
        <button
        className="back-btn"
        onClick={() => navigate("/")}
        style={{ position: "absolute", top: "10px", left: "10px", zIndex: 1 }}
      >
        Back
      </button>
    <div className="flights-container">
      <h1>Book Your Flight</h1>
      <div className="flight-form">
        <input
          type="text"
          placeholder="From (Departure)"
          value={departure}
          onChange={(e) => setDeparture(e.target.value)}
        />
        <input
          type="text"
          placeholder="To (Destination)"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />
        <DatePicker
          selected={departureDate}
          onChange={(date) => setDepartureDate(date)}
          placeholderText="Departure Date"
        />
        <DatePicker
          selected={returnDate}
          onChange={(date) => setReturnDate(date)}
          placeholderText="Return Date"
          minDate={departureDate}
        />
        <input
          type="number"
          placeholder="Travellers"
          value={travellers}
          onChange={(e) => setTravellers(Number(e.target.value))}
          min="1"
        />
        <select
          value={flightClass}
          onChange={(e) => setFlightClass(e.target.value)}
        >
          <option value="Economy">Economy</option>
          <option value="Business">Business</option>
          <option value="First">First Class</option>
        </select>
        <button onClick={searchFlights} className="search-btn">
          Search Flights
        </button>
      </div>
    </div>
    </div>
  );
};

export default Flights;
