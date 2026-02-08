'use client'
import { useRouter } from 'next/navigation';
import './NavBar.css';


export default function NavBar() {

    const router = useRouter();

    return (
        <div className="navbar-container">

            <div>
                <button onClick={()=> router.push('/')}>Home</button>
            </div>
            <div className="flex space-x-2">    
                {/* <button onClick={()=> router.push('/signIn')}>Log In</button>
                <button onClick={()=> router.push('/signUp')}>Sign Up</button> */}
            </div>



        </div>
    )
}