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
  Container, 
  Flex, 
  Heading, 
  Text,
  useToast } from '@chakra-ui/react';


function App() {
  const [recommendations, setRecommendations] = useState<PossibleBook[]>([])
  const [currentSearch, setCurrentSearch] = useState<string>("")
  const [isSearching, setSearching] = useState(false)
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

  async function onSearch(description: string) {
    setAccordionIndex(1)
    if(isSearching) {
      return
    }
    setSearching(true)
    setCurrentSearch(description)
    populateResults([])

    await getRecommendationService().getRecommendationStream(description, onRecommendation)
    setSearching(false)
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
        <AccordionItem isDisabled={!isSearching && recommendations.length === 0}>
          <AccordionButton>
          <Container>
              <Heading>
                Results
              </Heading>
            </Container>
            <AccordionIcon/>
          </AccordionButton>
          <AccordionPanel>
            <BookResultList results={recommendations} isSearching={isSearching} currentSearch={currentSearch}/>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Flex>
  );
}

export default App;
