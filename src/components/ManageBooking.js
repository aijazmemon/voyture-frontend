import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import JsBarcode from 'jsbarcode';
import './ManageBooking.css';

const ManageBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null); // For modal display
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const authToken = localStorage.getItem('authToken');
        const response = await axios.get('http://localhost:5000/api/bookings', {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        setBookings(response.data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Regenerate barcode when selectedTicket changes
  useEffect(() => {
    if (selectedTicket) {
      JsBarcode("#barcode", selectedTicket._id, { format: "CODE128" });
    }
  }, [selectedTicket]);

  const handleDeleteBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        const authToken = localStorage.getItem('authToken');
        await axios.delete(`http://localhost:5000/api/bookings/${bookingId}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        setBookings((prevBookings) => prevBookings.filter((booking) => booking._id !== bookingId));
      } catch (error) {
        console.error('Error deleting booking:', error);
      }
    }
  };

  const handleShowTicket = (booking) => {
    setSelectedTicket(booking); // Show selected ticket in modal
  };

  const closeModal = () => {
    setSelectedTicket(null);
  };

  if (loading) return <div>Loading bookings...</div>;

  return (
    <div className='manage-booking-parent'>
      <button className="back-btn" onClick={() => navigate("/")} style={{ position: "absolute", top: "10px", left: "10px" }}>Back</button>
      <div className="manage-booking">
        <h1>My Bookings</h1>
        {bookings.length === 0 ? (
          <p>No bookings available.</p>
        ) : (
          <ul className="booking-list">
            {bookings.map((booking) => (
              <li key={booking._id} className="booking-item">
                <h3>{booking.experience.title}</h3>
                <p>Date: {new Date(booking.date).toLocaleDateString()}</p>
                <p>Time slot: {booking.timeSlot}</p>
                <p>Guests: {booking.guests}</p>
                <p>Location: {booking.experience.city}, {booking.experience.state}</p>
                <button className='cancel-btn' onClick={() => handleDeleteBooking(booking._id)}>Cancel Booking</button>
                <button className='show-ticket-btn' onClick={() => handleShowTicket(booking)}>Show Ticket</button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Modal for Ticket */}
      {selectedTicket && (
        <div className="ticket-modal">
          <div className="ticket-content">
            <button onClick={closeModal} className="close-btn">X</button>
            <h2>Ticket for {selectedTicket.experience.title}</h2>
            <p>Ticket Number: {selectedTicket._id.slice(-5)}</p>
            <p>Date: {new Date(selectedTicket.date).toLocaleDateString()}</p>
            <p>Guests: {selectedTicket.guests}</p>
            <p>Location: {selectedTicket.experience.city}, {selectedTicket.experience.state}</p>
            <svg id="barcode"></svg> {/* Barcode */}
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageBooking;
