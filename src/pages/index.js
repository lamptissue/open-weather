import { useEffect, useState, useRef } from "react";
export default function Home() {
  const apiKey = process.env.NEXT_PUBLIC_API_KEY;

  const [weatherData, setWeatherData] = useState(null);
  const [selectCity, setSelectCity] = useState("london");
  const [unitTemperature, setUnitTemperature] = useState("metric");

  const fetchData = async () => {
    try {
      const geoResponse = await fetch(
        `http://api.openweathermap.org/data/2.5/forecast?q=${selectCity}&appid=${apiKey}&units=${unitTemperature}`
      );
      const data = await geoResponse.json();

      setWeatherData(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  console.log("weather data", weatherData);

  const currentDate = new Date();
  const currentHour = currentDate.getHours();
  console.log("current", currentDate);
  console.log("hour", currentHour);

  const currenttpoo = new Date().toISOString().split("T")[0]; // Current date in YYYY-MM-DD format
  console.log("poo", currenttpoo);

  if (currentHour < 12) {
    console.log("its before 12pm");
  } else if (currentHour < 15) {
    console.log("its before 3pm");
  } else if (currentHour < 18) {
    console.log("its before 6pm");
  } else if (currentHour < 21) {
    console.log("its before 9pm");
  }

  const handleInputChange = (e) => {
    setSelectCity(e.target.value);
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

  //filtered dates

  //today filtered

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
      {!weatherData ? (
        <h1>Select a city</h1>
      ) : weatherData.cod === "200" ? (
        <>
          <h1>
            5 day weather for {weatherData.city.name}, {weatherData.city.country}
          </h1>
          {weatherData.list
            .filter((item) => item.dt_txt.includes("12:00:00"))
            .map((item) => {
              const weather = item.weather[0];
              const date = new Date(item.dt * 1000).toDateString();
              return (
                <div key={item.dt} className='test-box'>
                  <p>{date}</p>
                  <img src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`} />

                  <p>{weather.description} </p>
                  <p>
                    {unitTemperature === "metric"
                      ? `${item.main.temp.toFixed(0)}°C`
                      : `${celsiusToFahrenheit(item.main.temp).toFixed(0)}°F`}
                  </p>
                </div>
              );
            })}
        </>
      ) : (
        <h1>Wrong city</h1>
      )}
    </main>
  );
}
