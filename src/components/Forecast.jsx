import React from 'react';

const Forecast = ({ data }) => {
 
  const forecastList = data?.list || (Array.isArray(data) ? data : []);

  if (forecastList.length === 0) return null;
  
  const dailyForecast = forecastList.filter((item) => item.dt_txt?.includes("12:00:00")).slice(0, 5);
  const displayData = dailyForecast.length > 0 
    ? dailyForecast 
    : forecastList.filter((_, index) => index % 8 === 0).slice(0, 5);

  const getDayName = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };
// ============================================
//  5-DAY FORECAST — Glassmorphism (Tailwind)
//  Matches the enhanced weather-card style
// ============================================

return (
  <div className="w-full max-w-4xl mx-auto mt-8 px-4">
    <h3 className="text-xl font-bold text-white tracking-wide mb-4">
      5-Day Forecast
    </h3>

    <div className="flex flex-row flex-nowrap gap-4 overflow-x-auto pb-2">
      {displayData.map((day, index) => {
        const dayName = getDayName(day.dt);
        const temp = Math.round(day.main?.temp);
        const iconCode = day.weather?.[0]?.icon;
        const condition = day.weather?.[0]?.description;

        return (
          <div
            key={day.dt || index}
            className="group relative flex flex-col items-center justify-between p-4
                       flex-1 min-w-[110px]
                       bg-white/10 backdrop-blur-xl backdrop-saturate-150
                       border border-white/20 rounded-2xl overflow-hidden
                       shadow-[0_8px_32px_rgba(0,0,0,0.37)]
                       transition-all duration-300 ease-out
                       hover:-translate-y-2 hover:scale-[1.04]
                       hover:bg-white/[0.18]
                       hover:shadow-[0_20px_50px_rgba(0,0,0,0.45)]"
          >
            {/* Glass shine highlight */}
            <span
              className="pointer-events-none absolute inset-x-0 top-0 h-1/2
                         bg-gradient-to-b from-white/20 to-transparent"
            />

            <p className="text-sm font-semibold text-gray-200 uppercase tracking-wider">
              {dayName}
            </p>

            {iconCode && (
              <img
                src={`https://openweathermap.org/img/wn/${iconCode}@2x.png`}
                alt={condition}
                className="w-14 h-14 my-2 object-contain
                           drop-shadow-[0_4px_12px_rgba(255,255,255,0.35)]
                           transition-transform duration-300
                           group-hover:scale-110 group-hover:-translate-y-1"
              />
            )}

            <div className="text-center">
              <span className="text-xl font-extrabold text-white">
                {temp}
                <sup className="text-xs align-super">°C</sup>
              </span>
              <p className="text-[10px] text-gray-300 font-medium capitalize mt-0.5 truncate max-w-[80px]">
                {condition}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);


};

export default Forecast;