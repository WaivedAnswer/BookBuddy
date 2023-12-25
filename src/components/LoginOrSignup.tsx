import { useAuthenticator } from '@aws-amplify/ui-react';
import {Button, Center, Flex} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
  
export default function LoginOrSignup() {
    const {signOut, user} = useAuthenticator((context) => [context.user])
  
    const navigate = useNavigate()
  
    const onLogin = () => {
      navigate("/login")
    }

    const onSignup = () => {
        navigate("/login")
      }
  
    const onLogout = async () => {
      signOut()
    }
    return (
        <Center mr={4} mt={2} mb={2}>
            {
                user ? <Button onClick={onLogout} >Logout</Button> : 
                (<Flex direction={{base: "column", xs: "row"}} gap={{base: 1, sm: 2, lg: 4}}>
                <Button size={{base:"sm", md:"md"}} onClick={onLogin}> Login</Button>
                <Button size={{base:"sm", md:"md"}} onClick={onSignup}> Signup</Button>
                </Flex>)
            }
                            
        </Center> 
    );
  }
  