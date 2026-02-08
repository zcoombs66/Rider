'use client'
import { fetchWeatherApi } from "openmeteo";
import { stringify } from "querystring";
import { useEffect, useState } from "react";
import NavBar from "../navbar/page";
import './stat.css';


export default function Stat() {


    const [formData, setFormData] = useState<{ 
        lat: number; 
        lon: number;
        minTemp: number;
        maxTemp: number;
        maxRain: number;
    } | null>(null);

    const [rideLikelihoods, setRideLikelihoods] = useState<
    { start: string; likelihood: number }[]
    >([]);

    const [loading, setLoading] = useState(true);

    function temperatureScore(
        temp: number,
        minTemp: number,
        maxTemp: number
    ) {
        if (temp < minTemp) {
            return Math.max(0, 100 - (minTemp - temp) * 5);
          }
          if (temp > maxTemp) {
            return Math.max(0, 100 - (temp - maxTemp) * 5);
          }
          return 100;
    }

    function rainScore(
        rainChance: number,
        maxRain: number 
    ) {
        maxRain = Math.min(Math.max(maxRain, 5), 80);
        if (rainChance <= maxRain) {
            const softness = 0.4;
            const ratio = rainChance / Math.max(1, maxRain);
            return Math.round(100 * (1 - softness * ratio));
          }
        
          
          const excess = rainChance - maxRain;
          const hardDrop = 2.5; 
        
          return Math.round(
            Math.max(0, 100 - excess * hardDrop - maxRain * 0.4)
          );
    }

    function rideLikelihood(
        block: { avgTemp:number; maxRain: number },
        prefs: { minTemp: number; maxTemp: number; maxRain: number}
    ) {
        const tScore = temperatureScore(
            block.avgTemp,
            prefs.minTemp,
            prefs.maxTemp
        );

        const rScore = rainScore(
            block.maxRain,
            prefs.maxRain
        );
        const t = tScore / 100;
        const r = rScore / 100;
        return Math.round(100 * t * r);
    }

    useEffect(() => {
        const raw = localStorage.getItem("formData");
        if (!raw) {
            console.error("No stored location data");
            setLoading(false);
            return;
        }

        const storedData = JSON.parse(raw);
        setFormData(storedData);

        async function fetchWeather() {
            try {
                const params = new URLSearchParams({
                    latitude: storedData.lat.toString(),
                    longitude: storedData.lon.toString(),
                    hourly: "precipitation_probability,temperature_2m",
                    timezone: "auto",
                    temperature_unit: "fahrenheit",
                    precipitation_unit: "inch",
                    forecast_days: '1',
                });

                const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
                const data = await res.json();
                console.log(data);
                const hourlyTemps = data.hourly.temperature_2m;
                const hourlyRain = data.hourly.precipitation_probability;

                const blocks = [];
                for (let i = 0; i < 24; i += 4) {
                const sliceTemps = hourlyTemps.slice(i, i + 4);
                const sliceRain = hourlyRain.slice(i, i + 4);
          
                const avgTemp =
                    sliceTemps.reduce((sum: number, t: number) => sum + t, 0) /
                    sliceTemps.length;
        
                const maxRain = Math.max(...sliceRain);
        
                blocks.push({ startHour: i, avgTemp, maxRain });


            }

            const likelihoods = blocks.map((block) => ({
                start: `${block.startHour}:00`,
                likelihood: rideLikelihood(block, storedData),
            }));
     
     setRideLikelihoods(likelihoods);
     setLoading(false);
    } catch (err) {
        console.error("Error fetching weather data:", err);
        setLoading(false);
    }
}
    fetchWeather();
    },[]);
    
     if (loading) {
        return (
        <div className="flex justify-center items-center min-h-screen">
            <h1 className="text-xl font-bold">Loading...</h1>
        </div>
        );
     }
     if (!formData) {
        return (
          <div className="flex justify-center items-center min-h-screen">
            <h1 className="text-xl font-bold text-red-500">No stored location data</h1>
          </div>
        );
      }

      function likelihoodToColor(likelihood: number) {
        const value = Math.max(0, Math.min(100, likelihood)) / 100;
      
        let r, g;
      
        if (value < 0.5) {
          r = 255;
          g = Math.round(510 * value);
        } else {
          r = Math.round(510 * (1 - value));
          g = 255;
        }
        return `rgb(${r}, ${g}, 0)`;
      }




    return (
    <div>
      <NavBar />
    <div className="max-w-3xl mx-auto p-6 container-stat">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Ride Likelihood for Today
      </h2>
      <div className="grid grid-cols-6 gap-4">
        {rideLikelihoods.map((block, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="w-full h-32 flex items-end">
              <div
                className="w-full rounded-md mb-2 transition-all"
                style={{
                  backgroundColor: likelihoodToColor(block.likelihood),
                  height: `${block.likelihood == 0 ?  1 : block.likelihood}%`,
                  }}
              ></div>
            </div>
            <span className="text-sm font-medium">{block.start}</span>
            <span className="text-sm text-gray-700">{block.likelihood}%</span>
          </div>
        ))}
      </div>
    </div>
    </div>
    );   
}