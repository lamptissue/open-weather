import { useState, useEffect } from "react";

import Image from "next/image";
import rain from "../../../public/img/rain.png";
import sun from "../../../public/img/sun.png";
import wind from "../../../public/img/wind.png";
import snow from "../../../public/img/snow.png";
import hot from "../../../public/img/hot.png";
import base from "../../../public/img/base.png";
import cold from "../../../public/img/cold.png";
import general from "../../../public/img/general.png";
import humid from "../../../public/img/humid.png";
import scarf from "../../../public/img/scarf.png";

function ImageComponent({ src, alt }) {
  return <Image src={src} width={250} height={250} style={{ position: "absolute", top: 0, left: 0 }} alt={alt} />;
}

function getImageComponent(activeCardData) {
  let images = new Set();

  if (activeCardData.weather[0].description === "clear sky") {
    images.add(<ImageComponent src={sun} alt='Sun Image' />);
  }

  if (activeCardData.main.temp > 25 && activeCardData.main.humidity < 70) {
    images.add(<ImageComponent src={hot} alt='Hot Image' />);
  }

  if (activeCardData.rain) {
    images.add(<ImageComponent src={rain} alt='Rain Image' />);
  }

  if (activeCardData.wind.speed > 10) {
    images.add(<ImageComponent src={wind} alt='Wind Image' />);
    images.add(<ImageComponent src={scarf} alt='Scarf Image' />);
  } else if (activeCardData.wind.speed > 6) {
    images.add(<ImageComponent src={scarf} alt='Scarf Image' />);
  }

  if (activeCardData.snow) {
    images.add(<ImageComponent src={snow} alt='Snow Image' />);
  }

  if (activeCardData.main.temp < 5 || activeCardData.snow) {
    images.add(<ImageComponent src={cold} alt='Cold Image' />);
  }

  if (activeCardData.main.humidity > 70 && activeCardData.main.temp > 25) {
    images.add(<ImageComponent src={humid} alt='Humid Image' />);
  }

  if (images.size === 0) {
    images.add(<ImageComponent src={general} alt='General Image' />);
  }

  return <>{Array.from(images)}</>;
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
  "brilliant",
  "amazing",
  "stunning",
  "incredible",
  "exceptional",
  "marvelous",
  "fantastic",
  "magnificent",
  "outstanding",
  "wonderful",
  "phenomenal",
  "remarkable",
  "impressive",
  "superb",
  "fabulous",
  "splendid",
  "admirable",
  "exquisite",
  "radiant",
  "dazzling",
  "gorgeous",
  "awesome",
  "charming",
  "delightful",
  "elegant",
  "graceful",
  "inspiring",
  "majestic",
  "unique",
  "vibrant",
];

export default function Outfits({ activeCardData }) {
  const [selectedCompliment, setSelectedCompliment] = useState("");

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * compliments.length);
    setSelectedCompliment(compliments[randomIndex]);
  }, [activeCardData]);

  return (
    <div className='flex-1 flex justify-center items-center flex-col'>
      <h1 className='font-semibold text-2xl mb-5 md:mt-0 mt-5'>
        What should you wear {activeCardData && getDayOfWeek(activeCardData.dt_txt)}?
      </h1>
      <div className='bg-white rounded-lg border shadow-md pb-4 fade-in flex justify-center items-center h-full w-1/2'>
        <div style={{ position: "relative" }} className='flex flex-col justify-center items-center'>
          <Image src={base} width={250} height={250} alt='Base Image' />
          {activeCardData ? (
            <>
              {getImageComponent(activeCardData)}
              <p className='font-semibold text-xl text-nowrap'>You look {selectedCompliment}!</p>
            </>
          ) : (
            <p>(Select a date to get your outfit)</p>
          )}
        </div>
      </div>
    </div>
  );
}
