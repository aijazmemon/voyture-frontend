import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import './BookingPage.css';

const BookingPage = () => {
    const { state } = useLocation();
    const { experience } = state || {};
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [guests, setGuests] = useState(1);
    const [selectedDate, setSelectedDate] = useState(null);
    const [timeSlot, setTimeSlot] = useState('');
    const navigate = useNavigate();

    const availableTimeSlots = [
        '09:00 AM - 11:00 AM',
        '11:00 AM - 01:00 PM',
        '02:00 PM - 04:00 PM',
        '04:00 PM - 06:00 PM'
    ];

    if (!experience) {
        return <p>Experience details not available.</p>;
    }

    const handleBackClick = () => {
        navigate('/experiences');
    };

    const handleConfirmBooking = async () => {
        if (!selectedDate || !timeSlot) {
            setError('Please select a date and time slot.');
            return;
        }
    
        setLoading(true);
        try {
            const response = await axios.post(
                `${apiBaseUrl}/api/bookings`,
                {
                    experienceId: experience._id,
                    guests,                   // Send guests
                    date: selectedDate,       // Send the selected date
                    timeSlot                  // Send the selected time slot
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`
                    }
                }
            );
            alert('Booking successful!');
            navigate('/manage-booking');
        } catch (error) {
            console.error('Booking failed:', error);
            setError('Failed to book. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <div className='booking-page-parent'>
            <button className='back-btn' onClick={handleBackClick} style={{ position: 'absolute', top: '10px', left: '10px' }}>
                Back
            </button>
            <div className="booking-page-container">
                <h2>Book {experience.title}</h2>
                <p>Location: {experience.city}, {experience.country}</p>
                <p>Price: ${experience.price}</p>

                <label>
                    Number of Guests:
                    <input
                        type="number"
                        min="1"
                        value={guests}
                        onChange={(e) => { setGuests(e.target.value); setError(null); }}
                    />
                </label>

                <label>
                    Select Date:
                    <DatePicker
                        selected={selectedDate}
                        onChange={(date) => { setSelectedDate(date); setError(null); }}
                        minDate={new Date()}
                        placeholderText="Select a date"
                    />
                </label>

                <label>
                    Select Time Slot:
                    <select
                        value={timeSlot}
                        onChange={(e) => { setTimeSlot(e.target.value); setError(null); }}
                    >
                        <option value="">Select a time slot</option>
                        {availableTimeSlots.map((slot, index) => (
                            <option key={index} value={slot}>{slot}</option>
                        ))}
                    </select>
                </label>

                <button className='confirm-booking-btn' onClick={handleConfirmBooking} disabled={loading}>
                    {loading ? 'Booking...' : 'Confirm Booking'}
                </button>
                {error && <p className="error-message">{error}</p>}
            </div>
        </div>
    );
};

export default BookingPage;
