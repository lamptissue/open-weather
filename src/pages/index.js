import { useState, useEffect } from "react";
import Image from "next/image";

import rain from "../../public/img/rain.png";
import sun from "../../public/img/sun.png";
import wind from "../../public/img/wind.png";
import snow from "../../public/img/snow.png";
import hot from "../../public/img/hot.png";
import base from "../../public/img/base.png";
import cold from "../../public/img/cold.png";
import general from "../../public/img/general.png";
import humid from "../../public/img/humid.png";
import scarf from "../../public/img/scarf.png";

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
  const handleUnitChange = (e) => {
    setUnitTemperature(e.target.value);
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

  const todayDate = new Date();
  const currentDate = todayDate.toISOString().split("T")[0];

  const filteredWeather = weatherData ? weatherData.list.filter((item) => !item.dt_txt.includes(currentDate)) : [];

  const fiveDayWeatherData = weatherData ? filteredWeather.filter((item) => item.dt_txt.includes("12:00:00")) : [];

  if (weatherData && filteredWeather.length > 5) {
    const lastElement = filteredWeather[filteredWeather.length - 1];
    const lastElementDate = new Date(lastElement.dt_txt).getHours();

    if (lastElementDate < 12) {
      fiveDayWeatherData.push(lastElement);
    }
  }

  const todayWeather = weatherData && weatherData.list[0];
  console.log("active", activeCardData);

  function getImageComponent(activeCardData) {
    let images = [];

    if (activeCardData.weather[0].description === "clear sky") {
      images.push(
        <Image src={sun} width={200} height={200} style={{ position: "absolute", top: 0, left: 0 }} alt='Sun Image' />
      );
    }

    if (activeCardData.main.temp > 25 && activeCardData.main.humidity < 70) {
      images.push(
        <Image src={hot} width={200} height={200} style={{ position: "absolute", top: 0, left: 0 }} alt='Hot Image' />
      );
    }

    if (activeCardData.rain) {
      images.push(
        <Image src={rain} width={200} height={200} style={{ position: "absolute", top: 0, left: 0 }} alt='Rain Image' />
      );
    } else if (activeCardData.wind.speed > 10) {
      images.push(
        <Image
          src={wind}
          width={200}
          height={200}
          style={{ position: "absolute", top: 0, left: 0 }}
          alt='Wind Image'
        />,
        <Image
          src={scarf}
          width={200}
          height={200}
          style={{ position: "absolute", top: 0, left: 0 }}
          alt='Scarf Image'
        />
      );
    }

    if (activeCardData.wind.speed > 6) {
      images.push(
        <Image
          src={scarf}
          width={200}
          height={200}
          style={{ position: "absolute", top: 0, left: 0 }}
          alt='Scarf Image'
        />
      );
    }

    if (activeCardData.snow) {
      images.push(
        <Image
          src={snow}
          width={200}
          height={200}
          style={{ position: "absolute", top: 0, left: 0 }}
          alt='Snow Image'
        />,
        <Image src={cold} width={200} height={200} style={{ position: "absolute", top: 0, left: 0 }} alt='Cold Image' />
      );
    }

    if (activeCardData.main.temp < 5) {
      images.push(
        <Image src={cold} width={200} height={200} style={{ position: "absolute", top: 0, left: 0 }} alt='Cold Image' />
      );
    }

    if (activeCardData.main.humidity > 70 && activeCardData.main.temp > 25) {
      images.push(
        <Image
          src={humid}
          width={200}
          height={200}
          style={{ position: "absolute", top: 0, left: 0 }}
          alt='Humid Image'
        />
      );
    }

    if (images.length === 0) {
      images.push(
        <Image
          src={general}
          width={200}
          height={200}
          style={{ position: "absolute", top: 0, left: 0 }}
          alt='General Image'
        />
      );
    }

    return <>{images}</>;
  }

  function getDayOfWeek(dateString) {
    const today = new Date();
    const date = new Date(dateString);

    const formattedToday = today.toISOString().split("T")[0];
    const formattedDate = date.toISOString().split("T")[0];

    if (formattedToday === formattedDate) {
      return "Today";
    }

    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return `on ${days[date.getDay()]}`;
  }

  const compliments = [
    "Brilliant",
    "Amazing",
    "Stunning",
    "Incredible",
    "Exceptional",
    "Marvelous",
    "Fantastic",
    "Magnificent",
    "Outstanding",
    "Wonderful",
    "Phenomenal",
    "Remarkable",
    "Impressive",
    "Superb",
    "Fabulous",
    "Splendid",
    "Admirable",
    "Exquisite",
    "Radiant",
    "Dazzling",
    "Gorgeous",
    "Awesome",
    "Charming",
    "Delightful",
    "Elegant",
    "Graceful",
    "Inspiring",
    "Majestic",
    "Unique",
    "Vibrant",
  ];

  // const random = Math.floor(Math.random() * compliments.length);
  const [selectedCompliment, setSelectedCompliment] = useState("");

  // Update the selectedCompliment when activeCardData changes
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * compliments.length);
    setSelectedCompliment(compliments[randomIndex]);
  }, [activeCardData]);
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
            <div className='flex'>
              {/* Container for top level */}
              <div className='flex-1'>
                <h1 className='font-semibold mb-5 fade-in text-2xl'>
                  Todays weather in {weatherData.city.name}, {weatherData.city.country}
                </h1>
                <div
                  className={`bg-white rounded-lg border shadow-md p-5 flex items-center justify-evenly text-center fade-in w-1/2 ${
                    activeCard !== null && !activeCard && activeCard !== 0 ? "border-sky-300 border-2" : ""
                  }`}
                  onMouseEnter={() => handleCardMouseEnter(todayWeather)}
                >
                  <div className='flex flex-col justify-evenly items-center'>
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
              </div>
              {/* Outfit div */}
              <div className='flex-1'>
                <h1 className='font-semibold text-2xl mb-5'>
                  What should you wear {activeCardData && getDayOfWeek(activeCardData.dt_txt)}?
                </h1>
                <div className='bg-white rounded-lg border shadow-md p-5 fade-in flex justify-center items-center h-full w-1/2'>
                  <div style={{ position: "relative" }} className='flex flex-col justify-center items-center'>
                    <Image src={base} width={200} height={200} alt='Base Image' />
                    {activeCardData ? (
                      <>
                        {getImageComponent(activeCardData)}
                        {/* <p className='font-semibold text-xl text-nowrap'>{compliments[random]}!</p> */}
                        <p className='font-semibold text-xl text-nowrap'>{selectedCompliment}!!</p>
                      </>
                    ) : (
                      <p>(Select a date to get your outfit)</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Other weather */}

            <div className='mt-5'>
              <h2 className='text-2xl font-semibold mb-5 fade-in'>{fiveDayWeatherData.length} day weather forecast</h2>

              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2 fade-in'>
                {fiveDayWeatherData.map((item, index) => {
                  const date = new Date(item.dt * 1000).toDateString();
                  const weather = item.weather[0];
                  return (
                    <div
                      className={`bg-white rounded-lg  border shadow-md p-4 flex flex-col items-center text-center fade-in  ${
                        activeCard === index ? "border-sky-300 border-2" : ""
                      }`}
                      key={item.dt}
                      onMouseEnter={() => handleCardMouseEnter(item, index)}
                    >
                      <p className='font-bold text-lg mb-2'>{date}</p>
                      <img
                        src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                        alt={`${weather.description} icon`}
                        className='mb-2'
                      />
                      <p className='text-sm text-gray-600 mb-1'>
                        {weather.description.charAt(0).toUpperCase() + weather.description.slice(1)}
                      </p>
                      <p className='font-semibold'>
                        Temperature: <span className='text-blue-600'>{temperatureDisplay(item.main.temp)}</span>
                      </p>
                      <p className='text-sm text-gray-600'>Wind: {item.wind.speed} m/s</p>
                      {item.pop ? (
                        <p className='text-sm text-gray-600'>Chance of rain: {Math.round(item.pop * 100)}%</p>
                      ) : (
                        ""
                      )}
                      {item.rain && <p className='text-sm text-gray-600'>Rain: {item.rain["3h"]} mm</p>}
                      <p className='text-sm text-gray-600'>Humidity: {item.main.humidity}%</p>
                      <p className='text-sm text-gray-600'>Pressure: {item.main.pressure} hPa</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* Temperature Unit */}
        <div className='flex justify-center items-center mt-5'>
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
