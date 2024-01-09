import { createContext, useContext, useEffect } from 'react';
import ReactGA from "react-ga4";


interface AnalyticsContextParams {
    trackAction: Function;
}
const AnalyticsContext = createContext<null | AnalyticsContextParams> (null);


export const AnalyticsProvider = ({ children } : any) => {
    //const location = useLocation()

    useEffect(() => { 
        ReactGA.initialize("G-7VL62VHHXE");}, [])

    const trackAction = (actionName: string) => {
        ReactGA.event({
            category: "Main",
            action: actionName,
          });
    }

    return (
        <AnalyticsContext.Provider value={{trackAction}}>
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