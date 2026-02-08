'use client'
import { fetchWeatherApi } from "openmeteo";
import { useEffect, useState } from "react";


export default function Stat() {


    const [formData, setFormData] = useState<{ lat: number; lon: number;} | null>(null);

    useEffect(() => {
        const raw = localStorage.getItem("formData");
        if (!raw) {
            console.error("No stored location data");
            return;
        }

        const storedData = JSON.parse(raw);
        setFormData(storedData);
    },[]);
    if (formData===null) {
        return(
            <div>
                <h1>Loading...</h1>
            </div>
        );
      }
    
    const params = {
        latitude: formData.lat,
        longitude: formData.lon,
        hourly: ["precipitation_probability", "temperature_2m"],
        timezone: "auto",
        forecast_days: 1,
        temperature_unit: "fahrenheit",
        precipitation_unit: "inch",
    }

    async function fetchData() {
        const url = "https://api.open-meteo.com/v1/forecast";
        const responses = await fetchWeatherApi(url, params);

        const response = responses[0];

        const latitude = response.latitude();
        const longitude = response.longitude();
        const elevation = response.elevation();
        const timezone = response.timezone();
        const timezoneAbbreviation = response.timezoneAbbreviation();
        const utcOffsetSeconds = response.utcOffsetSeconds();

        console.log(
            `\nCoordinates: ${latitude}°N ${longitude}°E`,
            `\nElevation: ${elevation}m asl`,
            `\nTimezone: ${timezone} ${timezoneAbbreviation}`,
            `\nTimezone difference to GMT+0: ${utcOffsetSeconds}s`,
        );

        const hourly = response.hourly()!;

        const weatherData = {
            hourly: {
                time: Array.from(
                    { length: (Number(hourly.timeEnd()) - Number(hourly.time())) / hourly.interval() }, 
                    (_, i) => new Date((Number(hourly.time()) + i * hourly.interval() + utcOffsetSeconds) * 1000)
                ),
                precipitation_probability: hourly.variables(0)!.valuesArray(),
                temperature_2m: hourly.variables(1)!.valuesArray(),
            },
        };

        console.log("\nHourly data:\n", weatherData.hourly);
        return weatherData;
    }

    fetchData()
    return (
        <div></div>
    );




    
}