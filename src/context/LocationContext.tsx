import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import ReactGA from "react-ga4";
import { isLocal } from '../services/isLocal';


interface LocationContextParams {
    longitude: number;
    latitude: number;
    fetchLocation: () => Promise<{latitude: number, longitude: number}>;
}
const LocationContext = createContext<null | LocationContextParams> (null);


export const LocationProvider = ({ children } : any) => {
    const [latitude, setLatitude] = useState<any | null>(null)
    const [longitude, setLongitude] = useState<any | null>(null)

    const fetchLocation : () => Promise<{latitude: number, longitude: number}> = useCallback(() => {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject("Geolocation is not supported by this browser.");
                return;
            }
            else if(latitude && longitude) {
                console.log("Cached:", latitude, longitude)
                resolve({latitude, longitude})
            }
            
            navigator.geolocation.getCurrentPosition(({ coords }) => {
                const { latitude, longitude } = coords
                setLatitude(latitude);
                setLongitude(longitude)
                resolve({latitude, longitude});
              },
              (error) => {
                reject("Error obtaining location: " + error.message);
              });
        })
        
    }, [])

    return (
        <LocationContext.Provider value={{fetchLocation, longitude, latitude}}>
        {children}
        </LocationContext.Provider>
    );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (context === null) {
    throw new Error('useLocation must be used within a Location Provider');
  }
  return context;
};