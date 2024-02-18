import { fetchAuthSession } from 'aws-amplify/auth';

export enum SubscriptionType {
    UNKNOWN="UNKNOWN",
    FAILED="FAILED",
    NONE="NONE",
    ACTIVE="ACTIVE",
}

export interface SubscriptionService {
    getSubscriptionStatus(): Promise<SubscriptionType>
}

class RealSubscriptionService implements SubscriptionService {
    async getSubscriptionStatus(): Promise<SubscriptionType> {
        let token 
        try {
            const session = await fetchAuthSession()
            token = session.tokens?.idToken?.toString();
        } catch (error) {
            throw new Error("failed to retrieve session")
        }

        return fetch(process.env.REACT_APP_API_URL + "/subscription", {
            method: "GET",
            headers: {
                Authorization: "Bearer " + token,
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                console.error(response)
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            return response.json()
        })
        .then((responseData : any) => {
            if(!responseData.subscription_status) {
                throw new Error("Missing subscription status")
            }
            return getSubscriptionType(responseData.subscription_status)
        })
    }
}

function getSubscriptionType(value: string): SubscriptionType {
    // Check if the value matches any enum member
    if (Object.values(SubscriptionType).includes(value as SubscriptionType)) {
        return value as SubscriptionType;
    }
    // Return undefined or handle the case where there's no match
    return SubscriptionType.UNKNOWN;
}

class FakeSubscriptionService implements SubscriptionService {
    async getSubscriptionStatus(): Promise<SubscriptionType> {
        return SubscriptionType.NONE
    }
}

export function getSubscriptionService() {
    return new RealSubscriptionService()
}