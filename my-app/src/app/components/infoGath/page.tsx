'use client'
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import NavBar from "../navbar/page";
import './infoGath.css'

const apiKey = process.env.NEXT_PUBLIC_API_KEY;


export default function Info() {
    const router = useRouter();
    const [form, setForm] = useState<{
        minTemp: number;
        maxTemp: number;
        maxRain: number;
        zipCode: string;
        lon: number;
        lat: number;
    }>({
        minTemp: 0,
        maxTemp: 0,
        maxRain: 0,
        zipCode: '',
        lon: 0,
        lat: 0,
    });

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const {name, value,} = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    }


    const [isSubmitting, setIsSubmitting] = useState(false);

    async function fetchLocation(zip: string ){

        try{
            const response = await fetch(`http://api.openweathermap.org/geo/1.0/zip?zip=${zip},US&appid=${apiKey}`);


            if (!response.ok) {
                 throw new Error(`Error: ${response.status}`);
            }
            const result = await response.json();
            console.log("LINES I GUESS");
            console.log(result);

            // setForm(prev => ({
            //     ...prev,
            //     lat: result.lat,
            //     lon: result.lon,
            // }))
            form.lat = result.lat;
            form.lon = result.lon;
            

        } catch(error) {
            console.error(error);
        }


    }

    async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>): Promise<void> {
        e.preventDefault();
        
        const location = await fetchLocation(form.zipCode);

        localStorage.setItem('formData', JSON.stringify(form));
        console.log(form);
        
        router.push('/stat')
        
        
    }


    return (
    <div className="container">  
            <form onSubmit={handleSubmit}>
                <h2>Weather Form</h2>

                <div className="temperature">
                    <label htmlFor="minTemp">Min Temperature(F)</label>
                    <input
                        name="minTemp"
                        value={form.minTemp}
                        onChange={handleChange}
                        required

                    />
                    <label htmlFor="maxTemp">Max Temperature(F)</label>
                    <input
                        name="maxTemp"
                        value={form.maxTemp}
                        onChange={handleChange}
                        required

                    />
                </div>
                <div className="rain-chance">
                    <label htmlFor="maxRain">Max Rain Chance(%)</label>
                    <input
                        name="maxRain"
                        value={form.maxRain}
                        onChange={handleChange}
                        required
                    />

                </div>
                <div className="zip-code">
                    <label htmlFor="zipCode">ZipCode:</label>
                    <input
                        name="zipCode"
                        value={form.zipCode}
                        onChange={handleChange}
                        required />
                </div>
                <div className="submitButton">
                    <button type="submit" >Submit</button>
                </div>



            </form>
               

    </div>
    );

}