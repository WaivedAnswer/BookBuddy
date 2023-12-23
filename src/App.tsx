import {
  Box, 
  Divider, 
  Flex, 
  Heading, 
  Text,
  Center,
  Button,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel} from '@chakra-ui/react';
import SocialShareBar from './components/SocialShareBar';
import SearchTab from './components/SearchTab';
import { useEffect, useRef, useState } from 'react';
import WishList from './components/WishList';
import { WishlistProvider } from './context/WishlistContext';
import WishlistTabTitle from './components/WishlistTabTitle';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { useNavigate } from 'react-router-dom';
import MainApp from './components/MainApp';

function App() {
  const [headerOffset, setHeaderOffset] = useState(0)
  const {signOut, user} = useAuthenticator((context) => [context.user])

  const navigate = useNavigate()
  const headerRef = useRef<any>(null)
  useEffect(() => {
    if(headerRef.current) {
      const headerRect = headerRef.current.getBoundingClientRect()
      setHeaderOffset(headerRect.height)
    }

  }, [])

  const onLogin = () => {
    navigate("/login")
  }

  const onLogout = async () => {
    signOut()
  }

  const email = process.env.REACT_APP_FEEDBACK_EMAIL
  return (
      <Flex className="App" direction="column" minHeight="100vh">
        <Flex as="header" 
        ref={headerRef}
        className="App-header" 
        direction="column" 
        width="100%" 
        bgColor="primary" 
        align="center"
        top={{base: "-1px", md: 0}}
        position="sticky"
        zIndex={1}>
          <Heading as="h1" color="white">FindMyRead</Heading>
          <Text size="xs" color="white">Great Books. Just For You</Text>
          {user ? <Button onClick={onLogout} >Logout</Button> : <Button onClick={onLogin} >Login</Button>}
        </Flex>
        {user ? <MainApp headerOffset={headerOffset}/> : <SearchTab/>}
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
