import { useState } from "react";
import WeatherCard from "./WeatherCard";
import TemperatureUnit from "./TemperatureUnit";

export default function Home() {
  const apiKey = process.env.NEXT_PUBLIC_API_KEY;

  const [weatherData, setWeatherData] = useState(null);
  const [selectCity, setSelectCity] = useState("london");
  const [unitTemperature, setUnitTemperature] = useState("metric");
  const [errorMessage, setErrorMessage] = useState("");

  const fetchData = async () => {
    try {
      const geoResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${selectCity}&appid=${apiKey}&units=metric`
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

  console.log("weatherdata", weatherData);

  const todayDate = new Date();
  const currentDate = todayDate.toISOString().split("T")[0];

  const filteredWeather = weatherData ? weatherData.list.filter((item) => !item.dt_txt.includes(currentDate)) : [];

  const fiveDayWeatherData = weatherData ? filteredWeather.filter((item) => item.dt_txt.includes("12:00:00")) : [];

  if (weatherData && filteredWeather.length > 0) {
    const lastElement = filteredWeather[filteredWeather.length - 1];

    if (!lastElement.dt_txt.includes("12:00:00")) {
      console.log("Last element does not have '12:00:00':", lastElement);
      fiveDayWeatherData.push(lastElement);
    }
  }

  const todayWeather = weatherData ? weatherData.list.find((item) => item.dt_txt.includes(currentDate)) : [];

  const temperatureDisplay = (temp) => {
    return `${unitTemperature === "metric" ? `${temp.toFixed(0)}°C` : `${celsiusToFahrenheit(temp).toFixed(0)}°F`}`;
  };

  return (
    <main className='bg-orange-100 min-h-screen flex justify-center items-center flex-col'>
      <div className=' mx-auto p-5 items-cente mb-8 container'>
        <div className='flex mb-6 justify-center items-center'>
          <div className='flex items-center rounded overflow-hidden shadow-md'>
            <input
              type='text'
              name='weatherLocation'
              id='location'
              placeholder='Enter a location'
              className='p-2 rounded-l w-96'
              onChange={handleInputChange}
            />

            <button
              className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r'
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </div>

        {errorMessage && (
          <div className='flex justify-center align-center'>
            <p className='error-message font-semibold text-xl text-red-600 errorShake'>{errorMessage}</p>
          </div>
        )}
        {weatherData && (
          <>
            <h1 className='font-semibold mb-5 fade-in text-2xl'>
              Todays weather in {weatherData.city.name}, {weatherData.city.country}
            </h1>
            <div className='bg-white rounded-lg border shadow-md p-5 fade-in test-size flex justify-evenly items-center lg:w-1/3 sm:w-full max-h-60'>
              <div className='flex items-center flex-col justify-evenly'>
                <img
                  src={`https://openweathermap.org/img/wn/${todayWeather.weather[0].icon}@2x.png`}
                  alt={`${todayWeather.weather[0].description} icon`}
                  className='mb-2'
                />
                <p className='text-xl text-gray-600 mb-1'>
                  {todayWeather.weather[0].description.charAt(0).toUpperCase() +
                    todayWeather.weather[0].description.slice(1)}
                </p>
                <p className='font-semibold text-4xl'>{temperatureDisplay(todayWeather.main.temp)}</p>
              </div>

              <div>
                <p className='text-lg md:text-base text-gray-600'>
                  <span className='font-semibold'>Wind:</span> {todayWeather.wind.speed} m/s
                </p>
                {todayWeather.pop ? (
                  <p className='text-lg md:text-base text-gray-600'>
                    <span className='font-semibold'>Chance of rain:</span> {Math.round(todayWeather.pop * 100)}%
                  </p>
                ) : (
                  ""
                )}
                {todayWeather.rain && (
                  <p className='text-lg md:text-base text-gray-600'>
                    <span className='font-semibold'>Rain:</span> {todayWeather.rain["3h"]} mm
                  </p>
                )}
                <p className='text-lg md:text-base text-gray-600'>
                  <span className='font-semibold'>Humidity:</span> {todayWeather.main.humidity}%
                </p>
                <p className='text-lg md:text-base text-gray-600'>
                  <span className='font-semibold'>Pressure:</span> {todayWeather.main.pressure} hPa
                </p>
              </div>
            </div>

            <div className='mt-5'>
              <h2 className='text-2xl font-semibold mb-5 fade-in'>{fiveDayWeatherData.length} day weather forecast</h2>

              <WeatherCard data={fiveDayWeatherData} temperatureDisplay={temperatureDisplay} />
            </div>
          </>
        )}
        <div className='flex justify-center items-center mt-5'>
          {/* <TemperatureUnit /> */}
          <div className='inline-flex'>
            <button
              className={` hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l ${
                unitTemperature === "metric" ? "bg-blue-500" : "bg-gray-300"
              }`}
              value='metric'
              onClick={handleUnitChange}
            >
              °C
            </button>
            <button
              className={` hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r ${
                unitTemperature === "imperial" ? "bg-blue-500" : "bg-gray-300"
              }`}
              value='imperial'
              onClick={handleUnitChange}
            >
              °F
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
