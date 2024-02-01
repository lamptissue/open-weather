// TemperatureSwitch.js
export default function TemperatureUnit({ unitTemperature, setUnitTemperature }) {
  const handleUnitChange = (e) => {
    setUnitTemperature(e.target.value);
  };

  return (
    <div className='inline-flex'>
      <button
        className={`hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l ${
          unitTemperature === "metric" ? "bg-blue-500" : "bg-gray-300"
        }`}
        value='metric'
        onClick={handleUnitChange}
      >
        °C
      </button>
      <button
        className={`hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r ${
          unitTemperature === "imperial" ? "bg-blue-500" : "bg-gray-300"
        }`}
        value='imperial'
        onClick={handleUnitChange}
      >
        °F
      </button>
    </div>
  );
}
