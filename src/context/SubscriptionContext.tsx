import { createContext, useState, useContext, useCallback, useEffect } from 'react';
import { SubscriptionType, getSubscriptionService } from '../services/subscriptionStatus';
import { useAuthenticator } from '@aws-amplify/ui-react';

interface SubscriptionContextParams {
    updateSubscriptionStatus: () => Promise<void>
    clearContext: () => Promise<void>
    subscriptionStatus: SubscriptionType
    isActive: () => boolean
}

const SubscriptionContext = createContext<null | SubscriptionContextParams> (null);

export const SubscriptionProvider = ({ children } : any) => {
    const {user} = useAuthenticator((context) => [context.user])
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

    useEffect(() => {
        if(user) {
            updateSubscriptionStatus()
        } else {
            setSubscriptionStatus(SubscriptionType.UNKNOWN)
        }

    }, [user, updateSubscriptionStatus])

    const clearContext = useCallback(async () => {
        setSubscriptionStatus(SubscriptionType.UNKNOWN)
    }, [])

  return (
    <SubscriptionContext.Provider value={{ subscriptionStatus, updateSubscriptionStatus, isActive, clearContext }}>
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