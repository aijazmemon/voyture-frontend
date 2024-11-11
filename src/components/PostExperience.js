import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
//import "react-datepicker/dist/react-datepicker.css";
import "./host.css";

const PostExperience = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    country: "", // This will hold the ISO2 code
    state: "",
    city: "",
    price: "",
    //availableDates: [],
    image1: null,
    image2: null,
    image3: null,
  });
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Memoize API options to avoid re-creation on each render
  const apiOptions = useMemo(
    () => ({
      headers: {
        "X-RapidAPI-Key": "474eb47bedmsh1a244a5fa656434p1b6070jsn312a789698d5",
        "X-RapidAPI-Host": "country-state-city-search-rest-api.p.rapidapi.com",
      },
    }),
    []
  );

  // Fetch countries on component mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get(
          "https://country-state-city-search-rest-api.p.rapidapi.com/allcountries",
          apiOptions
        );
        setCountries(response.data);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };
    fetchCountries();
  }, [apiOptions]);

  // Fetch states when a country is selected
  useEffect(() => {
    const fetchStates = async () => {
      if (formData.country) {
        try {
          const response = await axios.get(
            `https://country-state-city-search-rest-api.p.rapidapi.com/states-by-countrycode?countrycode=${formData.country}`,
            apiOptions
          );
          // Store both state name and state code
          setStates(
            response.data.map((state) => ({
              name: state.name,
              isoCode: state.isoCode, // This should hold the state code
            }))
          );
        } catch (error) {
          console.error("Error fetching states:", error);
        }
      }
    };
    fetchStates();
  }, [apiOptions, formData.country]);

  // Fetch cities when a state is selected
  useEffect(() => {
    const fetchCities = async () => {
      if (formData.country && formData.state) {
        try {
          const response = await axios.get(
            `https://country-state-city-search-rest-api.p.rapidapi.com/cities-by-countrycode-and-statecode?countrycode=${formData.country}&statecode=${formData.state}`,
            apiOptions
          );
          setCities(response.data);
        } catch (error) {
          console.error("Error fetching cities:", error);
        }
      }
    };
    fetchCities();
  }, [apiOptions, formData.country, formData.state]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
  
    if (name === "images") {
      setFormData((prev) => ({
        ...prev,
        images: [...(prev.images || []), files[0]], // Append each image file to the images array
      }));
    } else if (name === "country") {
      setFormData((prev) => ({
        ...prev,
        country: value,
        state: "",
        city: "",
      }));
      setStates([]);
      setCities([]);
    } else if (name === "state") {
      setFormData((prev) => ({ ...prev, state: value, city: "" }));
      setCities([]);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  
  

  // Handle date selection
  {
    /*const handleDateChange = (date) => {
    setFormData((prev) => ({
      ...prev,
      availableDates: date ? [date.toISOString().split("T")[0]] : [],
    }));
  };*/
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    console.log("Country before submitting:", formData.country); // Log to confirm country code before submit
    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("location", formData.location);
    formDataToSend.append("country", formData.country); // This should now be the ISO2 code
    formDataToSend.append("state", formData.state);
    formDataToSend.append("city", formData.city);
    formDataToSend.append("price", formData.price);
    //formData.availableDates.forEach((date) =>
    //  formDataToSend.append("availableDates[]", date)
    //);
    formData.images.forEach((image) => {
      formDataToSend.append("images", image);
    });
    console.log(
      "FormData content before sending:",
      formDataToSend.get("country")
    ); // Log FormData to verify

    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No token found");

      await axios.post(
        "http://localhost:5000/api/experiences",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Experience posted successfully!");
      navigate("/your-posted-experiences");
    } catch (error) {
      setError("Failed to post the experience. Please try again.");
      console.error("Error posting experience:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="post-experience-parent"
      style={{ backgroundColor: "#fcdeca", minHeight: "100vh" }}
    >
      <div className="post-experience-container">
        <button
          className="back-btn"
          onClick={() => navigate("/")}
          style={{ position: "absolute", top: "10px", left: "10px" }}
        >
          Back
        </button>
        <h1>Post an Experience</h1>

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <input
            name="title"
            type="text"
            placeholder="Experience Title"
            onChange={handleChange}
            required
          />
          <textarea
            name="description"
            placeholder="Describe the experience"
            onChange={handleChange}
            required
          />
          <select
            name="country"
            onChange={handleChange}
            value={formData.country} // Ensure this binds correctly
            required
          >
            <option value="">Select Country</option>
            {countries.map((country) => (
              <option key={country.isoCode} value={country.isoCode}>
                {country.name}
              </option>
            ))}
          </select>
          <select
            name="state"
            onChange={handleChange}
            value={formData.state}
            required
          >
            <option value="">Select State</option>
            {states.map((state) => (
              <option key={state.isoCode} value={state.isoCode}>
                {state.name}
              </option>
            ))}
          </select>

          <select
            name="city"
            onChange={handleChange}
            value={formData.city}
            required
          >
            <option value="">Select City</option>
            {cities.map((city) => (
              <option key={city.name} value={city.name}>
                {city.name}
              </option>
            ))}
          </select>

          <input
            name="price"
            type="number"
            placeholder="Price"
            onChange={handleChange}
            required
          />
          {/* <div className="date-picker-container">
          <DatePicker
            selected={
              formData.availableDates[0]
                ? new Date(formData.availableDates[0])
                : null
            }
            onChange={handleDateChange}
            dateFormat="dd/MM/yyyy"
            placeholderText="Select available date"
            className="date-picker"
            isClearable
          />
        </div> */}

          {/* Image upload inputs */}
          <input
            name="images"
            type="file"
            accept="image/*"
            onChange={handleChange}
            required
          />
          <input
            name="images"
            type="file"
            accept="image/*"
            onChange={handleChange}
            required
          />
          <input
            name="images"
            type="file"
            accept="image/*"
            onChange={handleChange}
            required
          />
          <button
            className="post-experience-btn"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Posting..." : "Post Experience"}
          </button>
          {error && <p className="error-message">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default PostExperience;
