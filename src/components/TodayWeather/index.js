export default function TodayWeather({ weatherData, activeCard, handleCardMouseEnter, temperatureDisplay }) {
  const todayWeather = weatherData && weatherData.list[0];

  return (
    <>
      <h1 className='font-semibold mb-5 fade-in text-2xl'>
        Todays weather in {weatherData.city.name}, {weatherData.city.country}
      </h1>
      <div
        className={`bg-white rounded-lg border shadow-md px-5 py-8 flex items-center justify-evenly text-center fade-in ${
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
            {todayWeather.weather[0].description.charAt(0).toUpperCase() + todayWeather.weather[0].description.slice(1)}
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
    </>
  );
}
