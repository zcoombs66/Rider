'use client'
import { useRouter } from "next/navigation";
import './welcome.css';
export default function Welcome() {
     const router = useRouter();

    return (

        <div className="welcome-container">

            <h1 className="title-container">Welcome to Fair Weather Rider</h1>
            <button className="button" onClick={()=> router.push('/info')}>How is it Looking?</button>

        </div>




    );
}