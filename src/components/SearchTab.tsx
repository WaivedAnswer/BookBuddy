import { useEffect, useState } from 'react';

import { PossibleBook, getRecommendationService } from '../services/recommendations';

import BookResultList from './BookResultList';
import SearchArea from './SearchArea';
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
  useToast} from '@chakra-ui/react';
import SearchDemo from './SearchDemo';
import React from 'react';

interface SearchTabParams {

}

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

export default function SearchTab({} : SearchTabParams) {
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

    return (
    <Box flex="1">
      <MemoSearchDemo />
      <Flex direction="column" margin={{ base: "0% 0%", md: "0% 5%", lg: "0% 10%" }} justify="flex-start">
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
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel>
              <SearchArea onSearch={onSearch} />
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem isDisabled={searchStatus !== SearchStatus.SEARCHING && recommendations.length === 0}>
            <AccordionButton bgColor="gray.100">
              <Container>
                <Heading>
                  Results
                </Heading>
              </Container>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel>
              <BookResultList results={recommendations} isSearching={searchStatus === SearchStatus.SEARCHING} currentSearch={currentSearch} />
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Flex>
    </Box>)
  }