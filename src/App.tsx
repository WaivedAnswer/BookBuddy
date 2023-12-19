import { useEffect, useState } from 'react';

import './App.css';

import { PossibleBook, getRecommendationService } from './services/recommendations';

import BookResultList from './components/BookResultList';
import SearchArea from './components/SearchArea';
import {
  Accordion, 
  AccordionButton, 
  AccordionIcon, 
  AccordionItem, 
  AccordionPanel, 
  Box, 
  Container, 
  Divider, 
  Flex, 
  Heading, 
  Text,
  useToast, 
  Center,
  Button} from '@chakra-ui/react';
import SocialShareBar from './components/SocialShareBar';
import SearchDemo from './components/SearchDemo';
import React from 'react';

enum SearchStatus {
  INITIAL,
  SEARCHING,
  COMPLETE,
  ERROR,
  MODERATION_ERROR
}

const MemoSearchDemo = React.memo(() => (
  <SearchDemo/>
));

function App() {
  const [recommendations, setRecommendations] = useState<PossibleBook[]>([])
  const [currentSearch, setCurrentSearch] = useState<string>("")
  const [searchStatus, setSearchStatus] = useState<SearchStatus>(SearchStatus.INITIAL)
  const [accordionIndex, setAccordionIndex] = useState(0)
  const errorToast = useToast()

  
  const populateResults = (results: PossibleBook[]) => {
    setRecommendations(results)
  }

  const onAccordionChange = (accordionIndex: any) => {
    setAccordionIndex(accordionIndex)
  }
  

  const onRecommendation = (recommendation : PossibleBook) => {
    setRecommendations(prevRecommendations => [...prevRecommendations, recommendation])
  }

  useEffect( () => {
    if(searchStatus === SearchStatus.ERROR && recommendations.length === 0) {
      setAccordionIndex(0)
      errorToast({
        title: 'Search Failed',
        description: "Try again in a few minutes",
        status: 'error',
        duration: 9000,
        isClosable: true,
      })
    } else if(searchStatus === SearchStatus.MODERATION_ERROR && recommendations.length === 0) {
      setAccordionIndex(0)
      errorToast({
        title: 'Search Failed',
        description: "Blocked due to policy restrictions",
        status: 'warning',
        duration: 9000,
        isClosable: true,
      })
    }else if(searchStatus === SearchStatus.COMPLETE && recommendations.length === 0 ) {
      errorToast({
        title: 'No Results Found',
        description: "Try a different search",
        status: 'info',
        duration: 9000,
        isClosable: true,
      })
    }
      
  }, [errorToast, recommendations, searchStatus])

  async function onSearch(description: string) {
    setAccordionIndex(1)
    if(searchStatus === SearchStatus.SEARCHING) {
      return
    }
    setSearchStatus(SearchStatus.SEARCHING)
    setCurrentSearch(description)
    populateResults([])

    try {
      await getRecommendationService().getRecommendationStream(description, onRecommendation)
        setSearchStatus(SearchStatus.COMPLETE)
    } catch (error : any) {
      if (error.message === "MODERATION") {
        setSearchStatus(SearchStatus.MODERATION_ERROR)
      } else {
        setSearchStatus(SearchStatus.ERROR)
      }
    }
  }

  const email = process.env.REACT_APP_FEEDBACK_EMAIL
  return (
    <Flex className="App" direction="column" minHeight="100vh">
      <Flex as="header" className="App-header" direction="column" width="100%" bgColor="primary" align="center">
        <Heading as="h1" color="white">FindMyRead</Heading>
        <Text size="xs" color="white">Great Books. Just For You</Text>
      </Flex>
      <MemoSearchDemo/>
      <Flex direction="column" flex="1" margin={{base:"0% 0%", md:"0% 5%", lg: "0% 10%"}} justify="flex-start">
        <Accordion flex="4"
        className="App-body" 
        defaultIndex={0} 
        index={accordionIndex} 
        onChange={onAccordionChange} 
       
        borderRadius="5">
          <AccordionItem>
            <AccordionButton bgColor="gray.100"> 
              <Container>
                <Heading>
                  Search
                </Heading>
              </Container>
              <AccordionIcon/>
            </AccordionButton>
            <AccordionPanel>
              <SearchArea onSearch={onSearch}/>
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem isDisabled={searchStatus !== SearchStatus.SEARCHING && recommendations.length === 0}>
            <AccordionButton bgColor="gray.100">
            <Container>
                <Heading>
                  Results
                </Heading>
              </Container>
              <AccordionIcon/>
            </AccordionButton>
            <AccordionPanel>
              <BookResultList results={recommendations} isSearching={searchStatus === SearchStatus.SEARCHING} currentSearch={currentSearch}/>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Flex>
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
