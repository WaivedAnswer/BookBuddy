import {
  Box, 
  Divider, 
  Flex, 
  Heading, 
  Text,
  Center,
  Button,
  VStack} from '@chakra-ui/react';
import SocialShareBar from './components/SocialShareBar';
import { useEffect, useRef, useState } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import MainApp from './components/MainApp';
import LoginOrSignup from './components/LoginOrSignup';
import LandingPage from './components/LandingPage';
import ChooseLibrary from './components/ChooseLibrary';

function App() {
  const [headerOffset, setHeaderOffset] = useState(0)
  const {user} = useAuthenticator((context) => [context.user])

  const headerRef = useRef<any>(null)
  useEffect(() => {
    if(headerRef.current) {
      const headerRect = headerRef.current.getBoundingClientRect()
      setHeaderOffset(headerRect.height)
    }

  }, [])



  const email = process.env.REACT_APP_FEEDBACK_EMAIL
  return (
      <Flex className="App" direction="column" minHeight="100vh">
        <Flex as="header" 
        ref={headerRef}
        className="App-header" 
        direction="row" 
        width="100%" 
        bgColor="primary" 
        justify="space-between"
        top={{base: "-1px", md: 0}}
        position="sticky"
        zIndex={10}>
          <VStack gap={0} ml={4}>
            <Heading as="h1" color="white">FindMyRead</Heading>
            <Text size="xs" color="white">Great Books. Just For You</Text>
          </VStack>
          <LoginOrSignup/>
        </Flex>
          {user ? <MainApp headerOffset={headerOffset}/> : <LandingPage/>}
          <ChooseLibrary/>
        <Flex as="footer" className="App-footer" direction="row" width="100%" bgColor="primary" align="center" padding={{base:1, sm:4}}>
          <Center flex="1">
            <Button as="a"
            target="_blank" 
            href={`mailto:${email}?subject=FindMyRead Feedback`}
            colorScheme="whiteAlpha"
            borderRadius="full" 
            size={{base:"sm", md:"md"}}>
              <Text fontSize={{base:"sm", sm:"md"}} textAlign="center" color="white">Feedback</Text>
            </Button>
          </Center>
          <Box height="32px">
            <Divider orientation="vertical"></Divider>
          </Box>
          <Center flex={{base: "2", md:"1"}}>
            <SocialShareBar />
          </Center>
        </Flex>
      </Flex>
  );
}

export default App;
