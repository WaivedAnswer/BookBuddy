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

function App() {
  const [headerOffset, setHeaderOffset] = useState(0)
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
      direction="column" 
      width="100%" 
      bgColor="primary" 
      align="center"
      top={{base: "-1px", md: 0}}
      position="sticky"
      zIndex={1}>
        <Heading as="h1" color="white">FindMyRead</Heading>
        <Text size="xs" color="white">Great Books. Just For You</Text>
      </Flex>
      <Tabs flex="1" variant="enclosed-colored" align="start" size="md">
        <TabList position="sticky" top={{base: headerOffset - 2, md: headerOffset}} zIndex={1} bgColor="gray.200">
            <Tab><Text size="md">Search</Text></Tab>
            <Tab><Text size="md">Wishlist</Text></Tab>
          </TabList>
        <TabPanels>
          <TabPanel><SearchTab/></TabPanel>
          <TabPanel><WishList/></TabPanel>
        </TabPanels>
      </Tabs>
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
