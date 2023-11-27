import {Spinner, VStack } from '@chakra-ui/react';
import { useEffect, useRef } from 'react';


function LoadingIcon( ) {
    const myRef = useRef<HTMLImageElement>(null)
    useEffect(() => { 
        if(myRef.current) {
            myRef.current.scrollIntoView({ behavior: "smooth"})
        }
    }, [])
    return ( 
    <VStack className="loading-icon" justifyContent="center">
        <Spinner/>
    </VStack>
    )
}

export default LoadingIcon