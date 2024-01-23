export default function WeatherCard({ data, temperatureDisplay }) {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2 fade-in'>
      {data.map((item) => {
        const date = new Date(item.dt * 1000).toDateString();
        const weather = item.weather[0];
        return (
          <div
            className='bg-white rounded-lg  border shadow-md p-4 flex flex-col items-center text-center fade-in'
            key={item.dt}
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
  );
}
