export default function FiveDayWeather({ weatherData, activeCard, temperatureDisplay, handleCardMouseEnter }) {
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
  return (
    <>
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
              {item.pop ? <p className='text-sm text-gray-600'>Chance of rain: {Math.round(item.pop * 100)}%</p> : ""}
              {item.rain && <p className='text-sm text-gray-600'>Rain: {item.rain["3h"]} mm</p>}
              <p className='text-sm text-gray-600'>Humidity: {item.main.humidity}%</p>
              <p className='text-sm text-gray-600'>Pressure: {item.main.pressure} hPa</p>
            </div>
          );
        })}
      </div>
    </>
  );
}
