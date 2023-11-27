import logo from '../logo.svg';
import { useEffect, useRef } from 'react';


function LoadingIcon( ) {
    const myRef = useRef<HTMLImageElement>(null)
    useEffect(() => { 
        if(myRef.current) {
            myRef.current.scrollIntoView({ behavior: "smooth"})
        }
    }, [])
    return ( 
    <div className="loading-icon" >
        <img ref={myRef} src={logo} className="App-logo" alt="logo" />
        Loading...
    </div>
    )
}

export default LoadingIcon