import { useEffect, useRef, useState } from 'react';

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
  Flex, 
  Heading, 
  Text,
  useToast } from '@chakra-ui/react';

enum SearchStatus {
  INITIAL,
  SEARCHING,
  COMPLETE,
  ERROR
}

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
    } else if(searchStatus === SearchStatus.COMPLETE && recommendations.length === 0 ) {
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
    } catch (error) {
      setSearchStatus(SearchStatus.ERROR)
    }
  }

  return (
    <Flex className="App" direction="column" height="100vh">
      <Flex as="header" className="App-header" direction="column" width="100%" bgColor="primary" align="center">
        <Heading as="h1" color="white">FindMyRead</Heading>
        <Text size="xs" color="white">Great Books. Just For You</Text>
      </Flex>
      <Accordion className="App-body" h="100%" 
      defaultIndex={0} 
      index={accordionIndex} 
      onChange={onAccordionChange} 
      margin={{base:"0%", md:"5%", lg: "10%"}}
      borderRadius="5">
        <AccordionItem>
          <AccordionButton> 
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
          <AccordionButton>
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
      <Box textAlign="center" margin={4}>
        <Text size="xs" fontWeight="light" fontStyle="italic">* As an Amazon Associate I earn from qualifying purchases.</Text>
      </Box>
    </Flex>
  );
}

export default App;
