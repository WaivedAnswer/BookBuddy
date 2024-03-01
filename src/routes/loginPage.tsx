import { Flex, Heading } from "@chakra-ui/react";
import { useNavigate } from 'react-router-dom';
import { Authenticator } from "@aws-amplify/ui-react";
import { LoginFlow } from "../models/loginFlow";
import { useAnalytics } from "../context/AnalyticsContext";
import { SubscriptionType } from "../services/subscriptionStatus";
import { useSubscription } from "../context/SubscriptionContext";
import { useEffect } from "react";

interface LoginPageParams {
    initialState: LoginFlow
}
export default function CallbackPage({initialState} : LoginPageParams) {
  const {trackAction} = useAnalytics()
  const {subscriptionStatus} = useSubscription()
  const navigate = useNavigate()

  useEffect(() => {
    if( subscriptionStatus === SubscriptionType.ACTIVE ) {
        trackAction(`Login from ${initialState}`)
        navigate("/")
    } else if( subscriptionStatus === SubscriptionType.NONE || subscriptionStatus === SubscriptionType.CANCELLED) {
      navigate("/signup")
    } else if (subscriptionStatus === SubscriptionType.FAILED) {
      //allowing failed checks to still access front-end. assuming positive intent for a positive experience
      navigate("/")
    }
  }, [initialState, subscriptionStatus, navigate, trackAction])

  return (
    <Flex direction="column" align="center" height="100vh" justify="center" bgColor="primary">
      <Authenticator loginMechanisms={['username','email']} initialState={initialState}>
      {
          <Heading color="white">Loading...</Heading>
      }
    </Authenticator>
    </Flex>
  );
}