import React, { useEffect, useRef, useState } from 'react';

const mockWeatherData = {
  name: "Mumbai",
  sys: { country: "IN", sunrise: 1718538600, sunset: 1718585400 },
  main: { temp: 31, feels_like: 35, humidity: 78 },
  weather: [{ main: "Rain", icon: "09d", description: "heavy intensity rain" }],
  wind: { speed: 5.4 },
  visibility: 8000,
  coord: { lat: 19.0760, lon: 72.8777 }
};

const mockHourlyData = [
  { dt: 1718542200, main: { temp: 31 }, weather: [{ icon: "09d" }] },
  { dt: 1718553000, main: { temp: 30 }, weather: [{ icon: "09d" }] },
  { dt: 1718563800, main: { temp: 29 }, weather: [{ icon: "10d" }] },
  { dt: 1718574600, main: { temp: 28 }, weather: [{ icon: "10n" }] },
  { dt: 1718585400, main: { temp: 28 }, weather: [{ icon: "11n" }] }
];

const mockDailyData = [
  { dt: 1718625600, main: { temp: 30 }, weather: [{ description: "moderate rain", icon: "09d" }] },
  { dt: 1718712000, main: { temp: 29 }, weather: [{ description: "heavy rain", icon: "09d" }] },
  { dt: 1718798400, main: { temp: 31 }, weather: [{ description: "thunderstorm", icon: "11d" }] },
  { dt: 1718884800, main: { temp: 32 }, weather: [{ description: "broken clouds", icon: "04d" }] },
  { dt: 1718971200, main: { temp: 32 }, weather: [{ description: "few clouds", icon: "02d" }] }
];

export default function App() {
  const videoRef = useRef(null);
  const [videoOpacity, setVideoOpacity] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [weather, setWeather] = useState(null);
  const [hourly, setHourly] = useState([]);
  const [dailyForecast, setDailyForecast] = useState([]);
  const [aqi, setAqi] = useState(null);
  const [loading, setLoading] = useState(true); // Shuru mein loader dikhane ke liye
  const [loadingMessage, setLoadingMessage] = useState("Calibrating atmospheric sensors...");
  const [condition, setCondition] = useState("Clouds");

  const getWeatherVideo = (mainCondition) => {
    const cond = mainCondition?.toLowerCase();
    if (cond?.includes('cloud')) return "https://assets.mixkit.co/videos/preview/mixkit-clouds-moving-fast-in-the-sky-34224-large.mp4";
    if (cond?.includes('rain') || cond?.includes('drizzle') || cond?.includes('thunderstorm')) return "https://assets.mixkit.co/videos/preview/mixkit-rain-falling-on-black-umbrella-43209-large.mp4";
    if (cond?.includes('snow')) return "https://assets.mixkit.co/videos/preview/mixkit-snowy-mountain-landscape-with-trees-42353-large.mp4";
    if (cond?.includes('clear')) return "https://assets.mixkit.co/videos/preview/mixkit-bright-sun-shining-between-clouds-40899-large.mp4";
    return "https://assets.mixkit.co/videos/preview/mixkit-clouds-moving-fast-in-the-sky-34224-large.mp4";
  };

  const getAqiLabel = (aqiValue) => {
    switch (aqiValue) {
      case 1: return { text: "Good 🟢", color: "text-green-400" };
      case 2: return { text: "Fair 🟡", color: "text-yellow-400" };
      case 3: return { text: "Moderate 🟠", color: "text-orange-400" };
      case 4: return { text: "Poor 🔴", color: "text-red-400" };
      case 5: return { text: "Very Poor ☠️", color: "text-purple-400" };
      default: return { text: "N/A", color: "text-gray-400" };
    }
  };

  // Pehli baar kholne par 5 second ka pause
  useEffect(() => {
    const messages = [
      "Connecting to weather satellites...",
      "Fetching live troposphere metrics...",
      "Analyzing cloud density...",
      "Finalizing radar layouts..."
    ];
    
    let msgIndex = 0;
    const interval = setInterval(() => {
      if (msgIndex < messages.length) {
        setLoadingMessage(messages[msgIndex]);
        msgIndex++;
      }
    }, 1200);

    const timer = setTimeout(() => {
      setWeather(mockWeatherData);
      setHourly(mockHourlyData);
      setDailyForecast(mockDailyData);
      setAqi(3);
      setCondition("Rain");
      setLoading(false);
      clearInterval(interval);
    }, 5000); // Strict 5 Seconds Delay

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let animationFrameId;
    const handleLoopLogic = () => {
      if (!video) return;
      const currentTime = video.currentTime;
      const duration = video.duration;
      const fadeDuration = 0.5;
      if (duration > 0) {
        if (currentTime < fadeDuration) setVideoOpacity(currentTime / fadeDuration);
        else if (currentTime > duration - fadeDuration) setVideoOpacity((duration - currentTime) / fadeDuration);
        else setVideoOpacity(1);
      }
      animationFrameId = requestAnimationFrame(handleLoopLogic);
    };
    video.addEventListener('ended', () => {
      setVideoOpacity(0);
      setTimeout(() => { if (video) { video.currentTime = 0; video.play().catch(e => {}); } }, 100);
    });
    animationFrameId = requestAnimationFrame(handleLoopLogic);
    return () => cancelAnimationFrame(animationFrameId);
  }, [condition]);

  // Search karne par bhi 5 second ka immersive wait
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setWeather(null); // Pura data gayab taaki sirf video aur loader dikhe
    setLoadingMessage(`Locating ${searchQuery}... Syncing satellite array...`);

    setTimeout(() => {
      const conditions = ["Clear", "Clouds", "Rain"];
      const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
      
      setCondition(randomCondition);
      setWeather({
        ...mockWeatherData,
        name: searchQuery.charAt(0).toUpperCase() + searchQuery.slice(1),
        weather: [{ main: randomCondition, icon: randomCondition === "Clear" ? "01d" : randomCondition === "Clouds" ? "03d" : "09d", description: `pure ${randomCondition.toLowerCase()}` }],
        main: { temp: Math.floor(Math.random() * 15) + 20, feels_like: Math.floor(Math.random() * 15) + 22, humidity: 65 }
      });
      setAqi(Math.floor(Math.random() * 5) + 1);
      setLoading(false);
    }, 5000); // Strict 5 Seconds Delay for search too
  };

  const formatTime = (ts) => ts ? new Date(ts * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "";
  const temp = weather?.main ? Math.round(weather.main.temp) : null;

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-[#0a0d14] text-white z-[99999] font-sans text-xl">
      <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <video ref={videoRef} key={getWeatherVideo(condition)} src={getWeatherVideo(condition)} className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto object-cover -translate-x-1/2 -translate-y-1/2 transition-opacity duration-500" style={{ opacity: videoOpacity }} muted playsInline autoPlay loop />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70 backdrop-blur-[0.5px]" />
      </div>
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-start p-6 md:p-10 pointer-events-auto overflow-y-auto box-border gap-12">
        <header className="w-full text-center mt-4">
          <h1 className="text-7xl md:text-8xl font-black tracking-tight text-white drop-shadow-2xl">Skyline Weather</h1>
          <p className="text-lg text-gray-200 font-bold tracking-[0.3em] uppercase mt-4">Industrial Grade Forecaster</p>
        </header>
        <div className="w-full max-w-5xl px-4 flex flex-col sm:flex-row gap-5 justify-center items-center">
          <form onSubmit={handleSearchSubmit} className="flex gap-5 w-full justify-center">
            <input type="text" placeholder="Type any city (e.g. New York, London)..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full px-8 py-7 text-3xl rounded-3xl border border-white/10 focus:outline-none bg-white/10 backdrop-blur-2xl text-white placeholder-gray-300 transition-all" />
            <button type="submit" className="rounded-3xl px-20 py-7 text-3xl bg-white/20 hover:bg-white/30 text-white font-black border border-white/20 backdrop-blur-md">Search</button>
          </form>
        </div>

        {/* 5 Seconds Full Immersive Loader Screen */}
        {loading && (
          <div className="flex flex-col items-center justify-center mt-20 p-12 bg-black/40 backdrop-blur-xl border border-white/10 rounded-[40px] max-w-2xl text-center shadow-2xl animate-pulse">
            <div className="w-20 h-20 border-4 border-t-indigo-500 border-r-transparent border-b-indigo-400 border-l-transparent rounded-full animate-spin mb-6"></div>
            <p className="text-3xl font-black tracking-wide text-white drop-shadow">{loadingMessage}</p>
            <p className="text-sm text-gray-400 mt-3 uppercase tracking-widest font-bold">Establishing Secure Data Link (5s)</p>
          </div>
        )}

        {temp !== null && !loading && (
          <div className="w-full max-w-5xl flex flex-col gap-10 items-center">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 w-full items-stretch">
              <div className="p-12 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[40px] text-center flex flex-col justify-center items-center">
                <div className="flex justify-between items-center w-full mb-4">
                  <h2 className="text-4xl font-black tracking-wide">📍 {weather.name}, {weather.sys.country}</h2>
                  {aqi && <span className={`text-xl font-black px-5 py-2 rounded-full bg-black/40 border border-white/10 ${getAqiLabel(aqi).color}`}>AQI: {getAqiLabel(aqi).text}</span>}
                </div>
                <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`} alt="weather" className="w-52 h-52 drop-shadow-2xl" />
                <h1 className="text-9xl font-black tracking-tighter leading-none">{temp}°C</h1>
                <p className="text-2xl uppercase tracking-widest mt-6 bg-black/30 px-8 py-3 rounded-full border border-white/10 font-bold">{condition}</p>
              </div>
              <div className="p-12 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[40px] flex flex-col justify-between">
                <h3 className="text-2xl font-black uppercase tracking-widest text-gray-200 border-b border-white/10 pb-3">Highlights</h3>
                <div className="grid grid-cols-2 gap-8 my-auto">
                  <div className="bg-black/30 p-6 rounded-2xl border border-white/5"><p className="text-sm font-bold text-gray-300 uppercase tracking-wide">Feels Like</p><p className="text-3xl font-black mt-1">{Math.round(weather.main.feels_like)}°C</p></div>
                  <div className="bg-black/30 p-6 rounded-2xl border border-white/5"><p className="text-sm font-bold text-gray-300 uppercase tracking-wide">Humidity</p><p className="text-3xl font-black mt-1">{weather.main.humidity}%</p></div>
                  <div className="bg-black/30 p-6 rounded-2xl border border-white/5"><p className="text-sm font-bold text-gray-300 uppercase tracking-wide">Wind</p><p className="text-3xl font-black mt-1">{weather.wind.speed} m/s</p></div>
                  <div className="bg-black/30 p-6 rounded-2xl border border-white/5"><p className="text-sm font-bold text-gray-300 uppercase tracking-wide">Visibility</p><p className="text-3xl font-black mt-1">{(weather.visibility / 1000).toFixed(1)} km</p></div>
                </div>
                <div className="grid grid-cols-2 gap-6 mt-8 pt-6 border-t border-white/10 text-center">
                  <div><p className="text-sm font-bold text-yellow-400 uppercase tracking-wide">☀️ Sunrise</p><p className="text-2xl font-black mt-1">{formatTime(weather.sys.sunrise)}</p></div>
                  <div><p className="text-sm font-bold text-orange-400 uppercase tracking-wide">🌙 Sunset</p><p className="text-2xl font-black mt-1">{formatTime(weather.sys.sunset)}</p></div>
                </div>
              </div>
            </div>
            {hourly.length > 0 && (
              <div className="w-full bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[36px]">
                <h4 className="text-2xl font-black uppercase text-center text-gray-200 mb-8 tracking-widest">Hourly Forecast</h4>
                <div className="flex justify-center gap-8 overflow-x-auto pb-2">
                  {hourly.map((h, i) => (
                    <div key={i} className="flex flex-col items-center bg-black/30 p-6 rounded-2xl min-w-[140px] border border-white/10 transform transition-transform hover:scale-105">
                      <p className="text-lg font-black text-gray-200 tracking-wide">{new Date(h.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      <img src={`https://openweathermap.org/img/wn/${h.weather[0].icon}@2x.png`} className="w-24 h-24 drop-shadow-md" alt="i" />
                      <p className="text-4xl font-black text-white mt-1">{Math.round(h.main.temp)}°C</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {dailyForecast.length > 0 && (
              <div className="w-full mt-4">
                <h3 className="text-center font-black text-gray-200 text-3xl tracking-widest uppercase mb-8 drop-shadow-md">5-Day Forecast</h3>
                <div className="flex justify-center gap-8 flex-wrap lg:flex-nowrap px-2 pb-8">
                  {dailyForecast.map((d, i) => (
                    <div key={i} className="flex flex-col items-center justify-between p-12 w-full max-w-md h-[380px] bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[40px] transition-all hover:scale-105 shadow-2xl">
                      <p className="text-3xl font-black text-white tracking-wide">{new Date(d.dt * 1000).toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase()}</p>
                      <img src={`https://openweathermap.org/img/wn/${d.weather[0].icon}@4x.png`} className="w-40 h-40 object-contain drop-shadow-xl" alt="i" />
                      <div className="text-center"><span className="text-6xl font-black text-white">{Math.round(d.main.temp)}°C</span><p className="text-base text-gray-300 font-black capitalize mt-2 tracking-wide">{d.weather[0].description}</p></div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}