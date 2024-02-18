import { Flex } from "@chakra-ui/react";
import { Navigate, useNavigate } from 'react-router-dom';
import { Authenticator } from "@aws-amplify/ui-react";
import { LoginFlow } from "../models/loginFlow";
import { useAnalytics } from "../context/AnalyticsContext";
import { useSubscription } from "../context/SubscriptionContext";
import SubscriptionPage from "../components/SubscriptionPage";
import { useEffect } from "react";
import { SubscriptionType } from "../services/subscriptionStatus";

interface SignupPageParams {
    initialState: LoginFlow
}
export default function SignupPage({initialState} : SignupPageParams) {
  const {trackAction} = useAnalytics()
  const {subscriptionStatus} = useSubscription()
  const navigate = useNavigate()

  useEffect(() => {
    if( subscriptionStatus === SubscriptionType.ACTIVE ) {
        trackAction(`Login from ${initialState}`)
        navigate("/")
    }
  }, [initialState, subscriptionStatus, navigate, trackAction])

  return (
    <Flex direction="column" align="center" height="100vh" justify="center" bgColor="primary">
      <Authenticator loginMechanisms={['username','email']} initialState={initialState}>
      {() => { 
        return <SubscriptionPage/>
        }
      }
    </Authenticator>
    </Flex>
  );
}