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
    setSearching(false)
    //TODO figure out how to get the immediate value of recommendations
    setRecommendations([...recommendations, recommendation])
  }
  
  const setAllRecommendations = (allRecommendations : PossibleBook[]) => {
    setRecommendations(allRecommendations)
  }

  async function onSearch(description: string) {
    setSearching(true)
    setAccordionIndex(1)
    populateResults([])

    await getRecommendationService().getRecommendationStream(description, onRecommendation, setAllRecommendations)
    setSearching(false)
    //   return reader?.read().then(
    //     function processText({ done, value }) : any {
    //     if (done) return;
    //     const chunk = new TextDecoder("utf-8").decode(value);
    //     const resultChunks = chunk.split("\n")
    //     for( let result of resultChunks) {
    //       if(result.indexOf('{') === -1) {
    //         continue;
    //       }
    //       try {
    //         console.log(result)
    //         const bookObj = JSON.parse(result);
    //         if( "title" in bookObj && "author" in bookObj && "reason" in bookObj) {
    //           setSearching(false)
    //           updatedRecommendations = [...updatedRecommendations, bookObj]
    //           setRecommendations( updatedRecommendations);
    //         }
    //       } catch (e) {
    //         console.error('Error parsing chunk', e);
    //       }
    //     }
    //     return reader.read().then(processText);
    //   });
    // });

    // getRecommendationService().getRecommendations(description)
    //   .then((recommendations: PossibleBook[]) => {
    //     populateResults(recommendations)
    //   })
    //   .catch((error: any) => {
    //     setAccordionIndex(0)
    //     errorToast({
    //       title: 'Recommendation Failed',
    //       description: "Please try again.",
    //       status: 'error',
    //       duration: 9000,
    //       isClosable: true,
    //     })
    //   })
    //   .finally( () => {
    //     setSearching(false)
    //   })
  }

  return (
    <Flex className="App" direction="column">
      <header className="App-header">
        <Heading as="h1">FindMyRead</Heading>
        <Text size="xs">Great Books. Just For You</Text>
      </header>
      <Accordion className="App-body" h="100%" defaultIndex={0} index={accordionIndex} onChange={onAccordionChange} margin={{base:"0%", md:"5%", lg: "10%"}}>
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
