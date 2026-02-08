import { fetchWeatherApi } from "openmeteo";
import Stat from "../components/stat/page";

export default function StatPage(){

    return(
        <div>
            <h1>THIS IS THE STAT PAGE AWESOME</h1>
            <Stat/>
        </div>
    );
}