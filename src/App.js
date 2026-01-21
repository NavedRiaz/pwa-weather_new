import React, { useState, createContext } from "react";
import { fetchWeather } from "./api/fetchWeather";

const UnitContext = createContext();

const App = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [cityName, setCityName] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [unit, setUnit] = useState("C");

  const fetchData = async (e) => {
    if (e.key === "Enter") {
      await fetchWeatherData(cityName);
    }
  };

  const fetchWeatherData = async (city) => {
    if (!city) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWeather(city);
      setWeatherData(data);
      setCityName("");
      setError(null);
      if (!recentSearches.includes(data.location.name)) {
        setRecentSearches([data.location.name, ...recentSearches]);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRecentSearchClick = (city) => {
    fetchWeatherData(city);
  };

  const toggleUnit = () => {
    setUnit(unit === "C" ? "F" : "C");
  };

  const temperature =
    unit === "C"
      ? weatherData?.current.temp_c
      : weatherData?.current.temp_f;

  return (
    <UnitContext.Provider value={{ unit, toggleUnit }}>
      <div>
        <input
          type="text"
          placeholder="Enter city name..."
          value={cityName}
          onChange={(e) => setCityName(e.target.value)}
          onKeyDown={fetchData}
        />
        <button onClick={toggleUnit}>
          Switch to {unit === "C" ? "Fahrenheit" : "Celsius"}
        </button>
        {loading && <div>Loading...</div>}
        {error && <div style={{ color: "red" }}> {error}</div>}
        {recentSearches.length > 0 && (
          <div>
            <h3>Recent Searches</h3>
            <ul>
              {recentSearches.map((city, index) => (
                <li key={index} onClick={() => handleRecentSearchClick(city)}>
                  {city}
                </li>
              ))}
            </ul>
          </div>
        )}
        {weatherData?.location && !loading && (
          <div>
            <h2>
              {weatherData.location.name}, {weatherData.location.region},{" "}
              {weatherData.location.country}
            </h2>
            <p>
              Temperature: {temperature} °{unit}
            </p>
            <p>Condition: {weatherData.current.condition.text}</p>
            <img
              src={weatherData.current.condition.icon}
              alt={weatherData.current.condition.text}
            />
            <p>Humidity: {weatherData.current.humidity}</p>
            <p>Pressure: {weatherData.current.pressure_mb}</p>
            <p>Visibility: {weatherData.current.vis_km}</p>
          </div>
        )}
      </div>
    </UnitContext.Provider>
  );
};

export default App;
