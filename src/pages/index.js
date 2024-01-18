import { useEffect, useState, useRef } from "react";
export default function Home() {
  const apiKey = process.env.NEXT_PUBLIC_API_KEY;

  const [weatherData, setWeatherData] = useState(null);
  const [selectCity, setSelectCity] = useState("");
  const [unitTemperature, setUnitTemperature] = useState("metric");
  const [errorMessage, setErrorMessage] = useState("");

  const fetchData = async () => {
    try {
      const geoResponse = await fetch(
        `http://api.openweathermap.org/data/2.5/forecast?q=${selectCity}&appid=${apiKey}&units=${unitTemperature}`
      );
      const data = await geoResponse.json();
      if (data.cod === "200") {
        setWeatherData(data);
      } else {
        setWeatherData(null);
        setErrorMessage("not a valid location");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  console.log("weather data", weatherData);

  const handleInputChange = (e) => {
    setSelectCity(e.target.value);
    setErrorMessage("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchData();
  };
  const handleUnitChange = (e) => {
    setUnitTemperature(e.target.value);
  };

  function celsiusToFahrenheit(celsius) {
    return (celsius * 9) / 5 + 32;
  }

  const filteredWeather = weatherData ? weatherData.list.filter((item) => item.dt_txt.includes("12:00:00")) : [];

  const todayDate = new Date();
  const currentHour = todayDate.getHours();
  const currentTime = todayDate.toISOString().split("T")[0];
  let filterTodayWeather;
  let newData = [...filteredWeather];

  if (weatherData) {
    if (currentHour > 12) {
      filterTodayWeather = weatherData.list.find((item) => item.dt_txt.includes(currentTime));
      newData.unshift(filterTodayWeather);
    }
  }
  console.log("new", newData);
  return (
    <main>
      <div>
        <input type='text' name='weatherLocation' id='location' placeholder='Location' onChange={handleInputChange} />
        <input
          type='radio'
          id='celsius'
          name='temperature'
          value='metric'
          checked={unitTemperature === "metric"}
          onChange={handleUnitChange}
        />
        <label htmlFor='celsius'>°C</label>
        <input
          type='radio'
          id='fahrenheit'
          name='temperature'
          value='imperial'
          checked={unitTemperature === "imperial"}
          onChange={handleUnitChange}
        />
        <label htmlFor='fahrenheit'>°F</label>
        <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' onClick={handleSubmit}>
          Submit
        </button>
      </div>
      {errorMessage && <p className='error-message'>{errorMessage}</p>}

      {weatherData && (
        <>
          <h1>
            5 day weather for {weatherData.city.name}, {weatherData.city.country}
          </h1>
          <div className='testContainer'>
            {newData.map((item) => {
              const date = new Date(item.dt * 1000).toDateString();
              const weather = item.weather[0];
              return (
                <div key={item.dt} className='test-box'>
                  <p>{date}</p>
                  <img src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`} />
                  <p>{weather.description} </p>
                  <p>
                    Temperature:
                    {unitTemperature === "metric"
                      ? `${item.main.temp.toFixed(0)}°C`
                      : `${celsiusToFahrenheit(item.main.temp).toFixed(0)}°F`}
                  </p>
                  <p>Wind: {item.wind.speed}m/s</p>
                  {item.pop ? <p>Chance of rain: {item.pop * 100}%</p> : ""}
                  {item.rain && `Rain: ${item.rain["3h"]} mm`}
                  <p>Humidity: {item.main.humidity}</p>
                  <p>Pressure: {item.main.pressure}</p>
                </div>
              );
            })}
          </div>
        </>
      )}
    </main>
  );
}

// Empty the select weather
