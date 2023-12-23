import { Flex } from "@chakra-ui/react";
import { Navigate } from 'react-router-dom';
import { Authenticator } from "@aws-amplify/ui-react";

export default function CallbackPage() {
   
  return (
    <Flex direction="column" align="center" height="100vh" justify="center" bgColor="primary">
      <Authenticator loginMechanisms={['username','email']}>
      {({ signOut, user }) => (<Navigate to="/"/> )}
    </Authenticator>
    </Flex>
  );
}