import { fetchAuthSession } from 'aws-amplify/auth';


export interface StripeService {
    checkout(productKey: string): Promise<void>
    manageCustomer(): Promise<void>
}

class RealStripeService implements StripeService {
    async manageCustomer(): Promise<void> {
        let token 
        try {
            const session = await fetchAuthSession()
            token = session.tokens?.idToken?.toString();
        } catch (error) {
            throw new Error("failed to retrieve session")
        }
        return fetch(process.env.REACT_APP_API_URL + "/customer", {
            method: "POST",
            headers: {
                Authorization: "Bearer " + token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
            })
        })
        .then(response => {
            if (!response.ok) {
                console.error(response)
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        }).then((responseData: any)  => {
            if(!responseData.url) {
                throw new Error("Expecting customer url")
            }
            window.location.href = responseData.url
        })
    }
    
    async checkout(productKey: string): Promise<void> {
        let token 
        try {
            const session = await fetchAuthSession()
            token = session.tokens?.idToken?.toString();
        } catch (error) {
            throw new Error("failed to retrieve session")
        }

        return fetch(process.env.REACT_APP_API_URL + "/checkout", {
            method: "POST",
            headers: {
                Authorization: "Bearer " + token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                productKey: productKey
            })
        })
        .then(response => {
            if (!response.ok) {
                console.error(response)
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        }).then((responseData: any)  => {
            if(!responseData.url) {
                throw new Error("Expecting checkouturl")
            }
            window.location.href = responseData.url
        })
    }
}


export function getStripeService() {
    return new RealStripeService()
}