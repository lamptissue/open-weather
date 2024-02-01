import { useState } from "react";

import TemperatureUnit from "./TemperatureUnit";
import Outfits from "./Outfits";
import FiveDayWeather from "./FiveDayWeather";
import TodayWeather from "./TodayWeather";

export default function Home() {
  const apiKey = process.env.NEXT_PUBLIC_API_KEY;

  const [weatherData, setWeatherData] = useState(null);
  const [selectCity, setSelectCity] = useState("");
  const [unitTemperature, setUnitTemperature] = useState("metric");
  const [errorMessage, setErrorMessage] = useState("");
  const [activeCardData, setActiveCardData] = useState(null);
  const [activeCard, setActiveCard] = useState(null);

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

  function celsiusToFahrenheit(celsius) {
    return (celsius * 9) / 5 + 32;
  }

  const temperatureDisplay = (temp) => {
    return `${unitTemperature === "metric" ? `${temp.toFixed(0)}°C` : `${celsiusToFahrenheit(temp).toFixed(0)}°F`}`;
  };

  const handleCardMouseEnter = (data, index) => {
    setActiveCardData(data);
    setActiveCard(index);
  };

  return (
    <main className='bg-orange-100 min-h-screen flex justify-center items-center flex-col'>
      <div className=' mx-auto p-5 items-center mb-8 container'>
        <h1 className='text-center text-5xl mb-2'>Weather ⛅️</h1>
        <div className='flex mb-6 justify-center items-center'>
          <div className='flex items-center rounded overflow-hidden shadow-md'>
            <form onSubmit={handleSubmit}>
              <input
                type='text'
                name='weatherLocation'
                id='location'
                placeholder='Enter a location'
                className='p-2 rounded-l w-96'
                onChange={handleInputChange}
              />

              <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r'>Submit</button>
            </form>
          </div>
        </div>
        {errorMessage && (
          <div className='flex justify-center align-center'>
            <p className='error-message font-semibold text-xl text-red-600 errorShake'>{errorMessage}</p>
          </div>
        )}

        {weatherData && (
          <>
            <div className='flex flex-col md:flex-row'>
              <div className='flex-1'>
                <TodayWeather
                  weatherData={weatherData}
                  activeCard={activeCard}
                  temperatureDisplay={temperatureDisplay}
                  handleCardMouseEnter={handleCardMouseEnter}
                />
              </div>
              <Outfits activeCardData={activeCardData} />
            </div>

            <div className='mt-5'>
              <FiveDayWeather
                weatherData={weatherData}
                activeCard={activeCard}
                temperatureDisplay={temperatureDisplay}
                handleCardMouseEnter={handleCardMouseEnter}
              />
            </div>
          </>
        )}

        <div className='flex justify-center items-center mt-5'>
          <TemperatureUnit unitTemperature={unitTemperature} setUnitTemperature={setUnitTemperature} />
        </div>
      </div>
    </main>
  );
}
