import React, { useState } from 'react';
import './SearchBar.css';

const SearchBar = ({ onSearch }) => {
    const [city, setCity] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (city.trim()) {
            onSearch(city);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="search-bar-container">
            <label htmlFor="weather-search-input" className="visually-hidden" style={{ display: 'none' }}>
                Search City
            </label>
            
            <input 
                type="text" 
                id="weather-search-input"
                name="city"
                className="search-input"
                placeholder="Search city or region..." 
                value={city}
                onChange={(e) => setCity(e.target.value)}
            />
            <button type="submit" className="search-button">
                Search
            </button>
        </form>
    );
};

export default SearchBar;