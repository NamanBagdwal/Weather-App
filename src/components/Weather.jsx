import React from "react";
import SearchBar from "./SearchBar";
import CurrentWeather from "./CurrentWeather";
import Forecast from "./Forecast";
import { useWeather } from "../hooks/useWeather";
import "./Weather.css";

const Weather = () => {
  const { weatherData, loading, error, searchCity } = useWeather("Delhi");

  return (
    <div className="weather-container">
      <h2 className="weather-header">Live Weather Dashboard</h2>

      <SearchBar onSearch={searchCity} />

      {loading && <p className="weather-status-message">Fetching weather details...</p>}
      {error && <p className="weather-status-message" style={{ color: "#e53e3e" }}>{error}</p>}

      {weatherData && !loading && (
        <div className="dashboard-content">
          {/* Sahi data sub-objects pass kiye taaki components crash na hon */}
          <CurrentWeather data={weatherData.current} />
          <Forecast data={weatherData.forecast} />
        </div>
      )}
    </div>
  );
};

export default Weather;