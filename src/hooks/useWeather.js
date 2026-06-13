import { useState, useEffect, useCallback } from "react";
import { getWeatherData } from "../api/weather.jsx";

export const useWeather = (initialCity = "") => {
  const [city, setCity] = useState(initialCity);
  const [state, setState] = useState({
    data: null,
    loading: false,
    error: null,
  });

  // ✅ Fixed: Empty dependency array [] so this only runs ONCE on mount
  useEffect(() => {
    // ✅ If initialCity was provided, skip geolocation detection
    if (initialCity) return;

    let isMounted = true;
    setState((prev) => ({ ...prev, loading: true }));

    const fallbackToIP = async () => {
      try {
        const res = await fetch("https://ipapi.co/json/");
        const ipData = await res.json();
        if (isMounted) setCity(ipData.city || "Delhi");
      } catch {
        if (isMounted) setCity("Delhi");
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          if (isMounted)
            setCity(`${pos.coords.latitude},${pos.coords.longitude}`);
        },
        () => {
          fallbackToIP();
        },
        { timeout: 3000, enableHighAccuracy: false }
      );
    } else {
      fallbackToIP();
    }

    return () => {
      isMounted = false;
    };
  }, []); // ✅ Empty array - runs only once on mount

  // ✅ This effect runs whenever city changes to fetch weather data
  useEffect(() => {
    if (!city) return;

    const controller = new AbortController();
    let isMounted = true;

    const fetchData = async () => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const data = await getWeatherData(city, controller.signal);
        if (isMounted) {
          setState({ data, loading: false, error: null });
        }
      } catch (err) {
        if (isMounted && err.name !== "AbortError") {
          setState({
            data: null,
            loading: false,
            error: err.message || "Failed to fetch weather data.",
          });
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [city]); // ✅ Runs when city changes

  // ✅ Fixed: Added basic validation for city name length
  const searchCity = useCallback((newCity) => {
    if (!newCity || newCity.trim() === "") return;
    const trimmed = newCity.trim();
    if (trimmed.length < 2) return; // ✅ Avoid searching single characters
    setCity(trimmed);
  }, []);

  return {
    weatherData: state.data,
    loading: state.loading,
    error: state.error,
    currentCity: city,
    searchCity,
  };
};