import { Flex } from "@chakra-ui/react";
import { Navigate } from 'react-router-dom';
import { Authenticator } from "@aws-amplify/ui-react";
import { LoginFlow } from "../models/loginFlow";
import { useAnalytics } from "../context/AnalyticsContext";
import { useSubscription } from "../context/SubscriptionContext";
import SubscriptionPage from "../components/SubscriptionPage";

interface SignupPageParams {
    initialState: LoginFlow
}
export default function SignupPage({initialState} : SignupPageParams) {
  const {trackAction} = useAnalytics()
  const {isActive} = useSubscription()

  return (
    <Flex direction="column" align="center" height="100vh" justify="center" bgColor="primary">
      <Authenticator loginMechanisms={['username','email']} initialState={initialState}>
      {() => { 
        if( isActive() ) {
          trackAction(`Login from ${initialState}`)
          return (<Navigate to="/"/> )
        }
        return <SubscriptionPage/>
        }
      }
    </Authenticator>
    </Flex>
  );
}