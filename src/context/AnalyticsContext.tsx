import { createContext, useContext, useEffect } from 'react';
import ReactGA from "react-ga4";


interface AnalyticsContextParams {
}
const AnalyticsContext = createContext<null | AnalyticsContextParams> (null);


export const AnalyticsProvider = ({ children } : any) => {
    //const location = useLocation()

    useEffect(() => { ReactGA.initialize("G-7VL62VHHXE");}, [])
    return (
        <AnalyticsContext.Provider value={{}}>
        {children}
        </AnalyticsContext.Provider>
    );
};

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (context === null) {
    throw new Error('useAnalytics must be used within a Analytics');
  }
  return context;
};