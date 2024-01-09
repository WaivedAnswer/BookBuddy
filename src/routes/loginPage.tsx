import { Flex } from "@chakra-ui/react";
import { Navigate } from 'react-router-dom';
import { Authenticator } from "@aws-amplify/ui-react";
import { LoginFlow } from "../models/loginFlow";
import { useAnalytics } from "../context/AnalyticsContext";

interface LoginPageParams {
    initialState: LoginFlow
}
export default function CallbackPage({initialState} : LoginPageParams) {
  const {trackAction} = useAnalytics()
  return (
    <Flex direction="column" align="center" height="100vh" justify="center" bgColor="primary">
      <Authenticator loginMechanisms={['username','email']} initialState={initialState}>
      {() => { trackAction(`Login from ${initialState}`)
        return (<Navigate to="/"/> )}}
    </Authenticator>
    </Flex>
  );
}