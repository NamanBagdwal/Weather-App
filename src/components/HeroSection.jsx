import React, { useEffect, useRef, useState } from 'react';

const HeroSection = ({ weatherData, forecastData, onSearch }) => {
  const videoRef = useRef(null);
  const [videoOpacity, setVideoOpacity] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

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
        if (currentTime < fadeDuration) {
          setVideoOpacity(currentTime / fadeDuration);
        } else if (currentTime > duration - fadeDuration) {
          setVideoOpacity((duration - currentTime) / fadeDuration);
        } else {
          setVideoOpacity(1);
        }
      }
      animationFrameId = requestAnimationFrame(handleLoopLogic);
    };

    const handleVideoEnded = () => {
      if (!video) return;
      setVideoOpacity(0);
      setTimeout(() => {
        if (!video) return;
        video.currentTime = 0;
        video.play().catch(err => console.log("Video loop error:", err));
      }, 100);
    };

    video.addEventListener('ended', handleVideoEnded);
    animationFrameId = requestAnimationFrame(handleLoopLogic);

    return () => {
      cancelAnimationFrame(animationFrameId);
      video.removeEventListener('ended', handleVideoEnded);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  const temp = weatherData?.main ? Math.round(weatherData.main.temp) : null;
  const city = weatherData?.name;
  const country = weatherData?.sys?.country;
  const condition = weatherData?.weather?.[0]?.main;
  const iconCode = weatherData?.weather?.[0]?.icon;

  const forecastList = forecastData?.list || [];
  const dailyForecast = forecastList.filter((item) => {
    if (!item.dt_txt) return false;
    const itemDate = new Date(item.dt * 1000);
    const today = new Date();
    if (itemDate.getDate() === today.getDate()) return false;
    return item.dt_txt.includes("12:00:00");
  }).slice(0, 5);

  return (
    // fixed top-0 left-0 h-screen w-screen aur z-[9999] sabko force karke full screen karega
    <div className="fixed top-0 left-0 w-screen h-screen overflow-hidden bg-slate-950 text-white font-sans-inter flex flex-col justify-between p-6 z-[9999]">
      
      {/* 1. BULLETPROOF FULLSCREEN VIDEO BACKGROUND */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <video
          ref={videoRef}
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_083109_283f3553-e28f-428b-a723-d639c617eb2b.mp4"
          className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto object-cover -translate-x-1/2 -translate-y-1/2"
          style={{ opacity: videoOpacity }}
          muted
          playsInline
          autoPlay
          loop
        />
        {/* Tint overlay overlaying video background */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70 backdrop-blur-[0.5px] z-10" />
      </div>

      {/* 2. DYNAMIC FORECASTER CONTENT LAYER */}
      <div className="relative z-20 w-full h-full flex flex-col justify-between max-w-5xl mx-auto pointer-events-auto">
        
        {/* TITLE HEADER */}
        <header className="w-full text-center pt-2">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-wide text-white drop-shadow-md">
            Skyline Weather
          </h1>
          <p className="text-[10px] text-gray-400 font-semibold tracking-widest uppercase mt-1">
            Industrial Grade Forecaster
          </p>
        </header>

        {/* SEARCH BAR */}
        <div className="w-full max-w-xl mx-auto px-4 mt-2">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input 
              type="text" 
              placeholder="Search city or region..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-5 py-2.5 text-sm rounded-md border border-white/10 focus:outline-none bg-white/10 backdrop-blur-md text-white placeholder-gray-400"
            />
            <button 
              type="submit"
              className="rounded-md px-5 py-2.5 text-sm bg-indigo-950/90 hover:bg-indigo-900 text-white font-semibold border border-white/10 transition-all"
            >
              Search
            </button>
          </form>
        </div>

        {/* MAIN CURRENT WEATHER CARD */}
        <main className="flex justify-center items-center my-auto py-2">
          {temp !== null ? (
            <div className="w-56 p-5 bg-gradient-to-b from-indigo-900/60 to-purple-950/60 backdrop-blur-xl border border-white/15 rounded-2xl shadow-2xl">
              <h2 className="text-sm font-bold tracking-wide text-white">
                📍 {city}, {country}
              </h2>
              <p className="text-[10px] text-gray-400 font-medium mt-0.5">{currentDay}</p>
              
              {iconCode && (
                <img 
                  src={`https://openweathermap.org/img/wn/${iconCode}@2x.png`} 
                  alt={condition}
                  className="w-20 h-20 mx-auto object-contain drop-shadow-md"
                />
              )}

              <h1 className="text-5xl font-black text-white tracking-tighter mt-1">
                {temp}°C
              </h1>
              <p className="text-xs text-gray-300 font-semibold uppercase tracking-wider mt-1">
                {condition}
              </p>
            </div>
          ) : (
            <div className="p-6 bg-black/40 backdrop-blur-md border border-white/10 rounded-xl text-center max-w-sm">
              <h3 className="text-lg font-bold">Live Cinematic Dashboard</h3>
              <p className="text-xs text-gray-400 mt-1">Enter a city to project metrics directly over the stream.</p>
            </div>
          )}
        </main>

        {/* 5-DAY FORECAST GRID */}
        {forecastData && dailyForecast.length > 0 && (
          <div className="w-full mt-auto pb-2">
            <h3 className="text-center text-xs font-bold text-gray-400 tracking-wider uppercase mb-2">
              5-Day Forecast
            </h3>
            <div className="flex justify-center gap-2 overflow-x-auto">
              {dailyForecast.map((day, index) => {
                const dayName = new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
                const dTemp = Math.round(day.main?.temp);
                const dIcon = day.weather?.[0]?.icon;
                const dCond = day.weather?.[0]?.description;

                return (
                  <div
                    key={day.dt || index}
                    className="flex flex-col items-center justify-between p-3 w-[95px]
                               bg-gradient-to-b from-indigo-950/50 to-slate-900/50 backdrop-blur-md
                               border border-white/10 rounded-xl shadow-md"
                  >
                    <p className="text-[10px] font-bold text-gray-400 tracking-wider">
                      {dayName}
                    </p>
                    {dIcon && (
                      <img
                        src={`https://openweathermap.org/img/wn/${dIcon}@2x.png`}
                        alt={dCond}
                        className="w-10 h-10 object-contain"
                      />
                    )}
                    <div>
                      <span className="text-sm font-black text-white">
                        {dTemp}°C
                      </span>
                      <p className="text-[8px] text-gray-400 font-medium capitalize truncate max-w-[80px]">
                        {dCond}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default HeroSection;