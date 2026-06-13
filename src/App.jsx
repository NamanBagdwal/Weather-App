import React from 'react';
import SearchBar from './components/SearchBar';
import CurrentWeather from './components/CurrentWeather';
import Forecast from './components/Forecast';
import { useWeather } from './hooks/useWeather';

function App() {
  const { weatherData, loading, error, searchCity } = useWeather('New York');

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex flex-col items-center justify-start px-4 py-12 font-sans overflow-x-hidden">      
      <header className="w-full max-w-md mx-auto text-center mb-8">
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-200 tracking-tight">
          Skyline Weather
        </h1>
        <p className="text-xs font-semibold uppercase tracking-widest text-indigo-300/60 mt-1">
          Industrial Grade Forecaster
        </p>
      </header>

        <main className="w-full flex flex-col items-center justify-center">
                
        <SearchBar onSearch={searchCity} />

        {error && (
          <div className="w-full max-w-md mt-6 p-4 bg-red-500/10 backdrop-blur-md border border-red-500/20 rounded-xl flex items-center gap-3 animate-fade-in">
            <span className="flex-shrink-0 text-red-400 font-bold text-lg">⚠️</span>
            <p className="text-sm font-semibold text-red-200 tracking-wide">
              {error}
            </p>
          </div>
        )}
       
        {loading ? (
          <div className="flex flex-col items-center justify-center mt-16 space-y-4">
            <div className="w-12 h-12 border-4 border-indigo-400/20 border-t-indigo-400 rounded-full animate-spin"></div>
            <p className="text-xs font-bold text-indigo-300 uppercase tracking-widest animate-pulse">
              Retrieving Satellite Feeds...
            </p>
          </div>
        ) : (
         
          weatherData && (
            <div className="w-full flex flex-col items-center animate-fade-in">
              <CurrentWeather data={weatherData.current} />
              <Forecast data={weatherData.forecast} />
            </div>
          )
        )}
      </main>
      
      <footer className="mt-auto pt-12 text-center">
        <p className="text-[11px] font-bold text-slate-500 tracking-wider uppercase">
          Engineered using React & TailwindCSS
        </p>
      </footer>
    </div>
  );
}

export default App;