import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./HotelList.css";

const HotelList = () => {
  const location = useLocation();
  const allHotels = location.state?.hotels || [];
  const navigate = useNavigate();

  // Filter out placeholder entries
  const filteredHotels = allHotels.filter(hotel => hotel.name);

  // Pagination logic
  const hotelsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const startIndex = (currentPage - 1) * hotelsPerPage;
  const currentHotels = filteredHotels.slice(startIndex, startIndex + hotelsPerPage);

  const totalPages = Math.ceil(filteredHotels.length / hotelsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  const handleBackClick = () => {
    navigate('/');
  };
  return (
    <div className='hotel-list-parent'>
      <button className='back-btn' onClick={handleBackClick} style={{ position: 'absolute', top: '10px', left: '10px' }}>
            Back
        </button>
    <div className="hotel-list">
      {currentHotels.length > 0 ? (
        currentHotels.map((hotel, index) => (
          <div key={index} className="hotel-card">
            <img
              src={hotel.propertyImage?.image.url || "https://via.placeholder.com/150"}
              alt={hotel.name}
              className="hotel-image"
            />
            <h2 className="hotel-name">{hotel.name || "Hotel Name Not Available"}</h2>
            <p className="price">Price: {hotel.price?.lead.formatted || "Price not available"}</p>
            <p className="ratings">Rating: {hotel.reviews?.score || "No rating"}★</p>
            <p className="location">Location: {hotel.neighborhood?.name || "Location not available"}</p>
            <button className="book-hotel-btn">Book Hotel</button>
          </div>
        ))
      ) : (
        <p>No hotels found.</p>
      )}
      
      {/* Pagination controls */}
      <div className="pagination">
        <button onClick={handlePrevPage} disabled={currentPage === 1}>Previous</button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>Next</button>
      </div>
    </div>
    </div>
  );
};

export default HotelList;
