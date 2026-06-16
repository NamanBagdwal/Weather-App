export const getWeatherData = async (searchQuery) => {
  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  if (!API_KEY) {
    throw new Error("API Key missing! Check your .env file.");
  }

  const isCoordinates = /^[0-9.-]+,[0-9.-]+$/.test(searchQuery.trim().replace(/\s+/g, ''));
  let currentUrl = "";
  let forecastUrl = "";

  if (isCoordinates) {
    const [lat, lon] = searchQuery.split(",");
    currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat.trim()}&lon=${lon.trim()}&units=metric&appid=${API_KEY}`;
    forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat.trim()}&lon=${lon.trim()}&units=metric&appid=${API_KEY}`;
  } else {
    currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(searchQuery.trim())}&units=metric&appid=${API_KEY}`;
    forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(searchQuery.trim())}&units=metric&appid=${API_KEY}`;
  }
 
  const [currentRes, forecastRes] = await Promise.all([
    fetch(currentUrl),
    fetch(forecastUrl)
  ]);

  if (!currentRes.ok || !forecastRes.ok) {
    throw new Error("City not found or API error");
  }

  const currentData = await currentRes.json();
  const forecastData = await forecastRes.json();

  return {
    current: currentData,
    forecast: forecastData
  };
};