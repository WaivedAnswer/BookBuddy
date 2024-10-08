import { useAuthenticator } from '@aws-amplify/ui-react';
import {Button, Center, Flex, HStack, IconButton} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useRecommendations } from '../context/RecommendationContext';
import { useAnalytics } from '../context/AnalyticsContext';
import { SettingsIcon } from '@chakra-ui/icons';
import { useSubscription } from '../context/SubscriptionContext';
  
export default function LoginOrSignup() {
  const { trackAction } = useAnalytics()
  const {signOut, user} = useAuthenticator((context) => [context.user])
  const {clearContext} = useSubscription()
  const {clearRecommendations} = useRecommendations()

  const navigate = useNavigate()

  const onLogin = () => {
    trackAction("Login Click")
    navigate("/login")
  }

  const onSignup = () => {
    trackAction("Signup Click")
    navigate("/signup")
  }

  const onLogout = async () => {
    await signOut()
    await clearContext()
    await clearRecommendations()
  }

  const onSettings = () => {
    navigate("/settings")
  }

  return (
      <Center mr={4} mt={2} mb={2}>
          {
              user ? 
              <HStack>
                <IconButton aria-label='User Settings' icon={<SettingsIcon />} onClick={onSettings} />
                <Button onClick={onLogout} >Logout</Button>
              </HStack>
               : 
              (<Flex direction={{base: "column", xs: "row"}} gap={{base: 1, sm: 2, lg: 4}}>
              <Button size={{base:"sm", md:"md"}} onClick={onLogin}> Login</Button>
              <Button size={{base:"sm", md:"md"}} onClick={onSignup}> Sign up</Button>
              </Flex>)
          }
                          
      </Center> 
  );
  }
  