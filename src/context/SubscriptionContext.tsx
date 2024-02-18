import { createContext, useState, useContext, useCallback } from 'react';
import { SubscriptionType, getSubscriptionService } from '../services/subscriptionStatus';

interface SubscriptionContextParams {
    updateSubscriptionStatus: () => Promise<void>
    subscriptionStatus: SubscriptionType
    isActive: () => boolean
}

const SubscriptionContext = createContext<null | SubscriptionContextParams> (null);

export const SubscriptionProvider = ({ children } : any) => {
    const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionType>(SubscriptionType.UNKNOWN);
    const isActive = useCallback( () => {
        return subscriptionStatus === SubscriptionType.ACTIVE
    }, [subscriptionStatus])
    const updateSubscriptionStatus = useCallback(async () => {
        const subscriptionService = getSubscriptionService()
        try {
            const subscriptionStatus = await subscriptionService.getSubscriptionStatus();
            setSubscriptionStatus(subscriptionStatus);
        } catch (error) {
            console.error("Failed to load subscription", error)
            setSubscriptionStatus(SubscriptionType.FAILED)
        } finally {
            //set loading
        }
    }, []);

  return (
    <SubscriptionContext.Provider value={{ subscriptionStatus, updateSubscriptionStatus, isActive }}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === null) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};