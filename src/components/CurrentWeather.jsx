import React from 'react';
import './CurrentWeather.css';

const CurrentWeather = ({ data }) => {
  if (!data || !data.main) {
    return <div className="weather-status-message">Loading weather...</div>;
  }

  const city = data.name;
  const country = data.sys?.country;
  const temp = Math.round(data.main.temp);
  const condition = data.weather[0]?.main;
  const icon = data.weather[0]?.icon;
  const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

  return (
    <div className="current-weather">
      <h3 className="weather-location">
        {city}, {country}
      </h3>
      
      {icon && <img src={iconUrl} alt={condition} className="weather-icon" />}
      
      <h1 className="weather-temp">
        {temp}°C
      </h1>
      
      <p className="weather-condition">
        {condition}
      </p>
    </div>
  );
};

export default CurrentWeather;