import { Flex } from "@chakra-ui/react";
import { Navigate } from 'react-router-dom';
import { Authenticator } from "@aws-amplify/ui-react";
import { LoginFlow } from "../models/loginFlow";

interface LoginPageParams {
    initialState: LoginFlow
}
export default function CallbackPage({initialState} : LoginPageParams) {
   
  return (
    <Flex direction="column" align="center" height="100vh" justify="center" bgColor="primary">
      <Authenticator loginMechanisms={['username','email']} initialState={initialState}>
      {() => (<Navigate to="/"/> )}
    </Authenticator>
    </Flex>
  );
}