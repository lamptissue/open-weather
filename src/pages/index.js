import { useState } from "react";
export default function Home() {
  const apiKey = process.env.NEXT_PUBLIC_API_KEY;

  const [weatherData, setWeatherData] = useState(null);
  const [selectCity, setSelectCity] = useState("london");
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
        setErrorMessage("Not a valid location");
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

  const Weather = () => {
    return (
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {newData.map((item) => {
          const date = new Date(item.dt * 1000).toDateString();
          const weather = item.weather[0];

          return (
            <div
              key={item.dt}
              className='bg-white rounded-lg border-black border shadow-md p-4 flex flex-col items-center text-center'
            >
              <p className='font-bold text-lg mb-2'>{date}</p>
              <img
                src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                alt={`${weather.description} icon`}
                className='mb-2'
              />
              <p className='text-sm text-gray-600 mb-1'>{weather.description}</p>
              <p className='font-semibold'>
                Temperature:{" "}
                <span className='text-blue-600'>
                  {unitTemperature === "metric"
                    ? `${item.main.temp.toFixed(0)}°C`
                    : `${celsiusToFahrenheit(item.main.temp).toFixed(0)}°F`}
                </span>
              </p>
              <p className='text-sm text-gray-600'>Wind: {item.wind.speed}m/s</p>
              {item.pop ? <p className='text-sm text-gray-600'>Chance of rain: {Math.round(item.pop * 100)}%</p> : ""}
              {item.rain && <p className='text-sm text-gray-600'>Rain: {item.rain["3h"]} mm</p>}
              <p className='text-sm text-gray-600'>Humidity: {item.main.humidity}%</p>
              <p className='text-sm text-gray-600'>Pressure: {item.main.pressure} hPa</p>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <main className='bg-orange-100 min-h-screen flex justify-center items-center'>
      <div className='container mx-auto p-5 items-center'>
        <div className='flex items-center mb-6 gap-4'>
          <div>
            {weatherData ? (
              <h1 className='text-3xl font-semibold'>
                5 day weather for {weatherData.city.name}, {weatherData.city.country}
              </h1>
            ) : (
              <h1>Ya ma</h1>
            )}
          </div>
          <div className='flex items-center bg-slate-500 rounded-full overflow-hidden shadow-md'>
            <input
              type='text'
              name='weatherLocation'
              id='location'
              placeholder='Enter a location'
              className='p-2   rounded-l-full flex-grow'
              onChange={handleInputChange}
            />
            <div className='flex gap-2'>
              {/* Temperature */}
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
            </div>
            <button
              className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r-full'
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </div>
        {errorMessage && <p className='error-message'>{errorMessage}</p>}
        {weatherData && <Weather />}
      </div>
    </main>
  );
}

// Empty the select weather
