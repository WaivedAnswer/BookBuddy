import { useState } from 'react';

import './App.css';

import { PossibleBook, getRecommendationService } from './services/recommendations';

import BookResultList from './components/BookResultList';
import SearchArea from './components/SearchArea';
import {Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Center, Container, Flex, Heading, Text } from '@chakra-ui/react';

function App() {
  const [recommendations, setRecommendations] = useState<PossibleBook[]>([])
  const [isSearching, setSearching] = useState(false)
  const [accordionIndex, setAccordionIndex] = useState(0)

  const populateResults = (results: PossibleBook[]) => {
    setRecommendations(results)
  }

  const onAccordionChange = (accordionIndex: any) => {
    setAccordionIndex(accordionIndex)
  }

  function onSearch(description: string) {
    setSearching(true)
    setAccordionIndex(1)
    populateResults([])
    getRecommendationService().getRecommendations(description).then(
        (recommendations: PossibleBook[]) => {
        setSearching(false)
        populateResults(recommendations)
        })
        .catch((error: any) => {
        console.error("Error fetching recommendations:", error)
        });
    }

  return (
    <Flex className="App" direction="column">
      <header className="App-header">
        <Heading as="h1">FindMyRead</Heading>
        <Text size="xs">Find Great Books. Just For You</Text>
      </header>
      <Accordion className="App-body" h="100%" defaultIndex={0} index={accordionIndex} onChange={onAccordionChange}>
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
            <BookResultList results={recommendations} isSearching={isSearching}/>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Flex>
  );
}

export default App;
