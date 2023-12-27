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

export default function SearchTab() {
    const [recommendations, setRecommendations] = useState<PossibleBook[]>([])
    const [currentSearch, setCurrentSearch] = useState<string>("")
    const [searchStatus, setSearchStatus] = useState<SearchStatus>(SearchStatus.INITIAL)
    const [accordionIndexes, setAccordionIndexes] = useState([0])
    const errorToast = useToast()

    
    const populateResults = (results: PossibleBook[]) => {
        setRecommendations(results)
    }

    const onAccordionChange = (accordionIndex: any) => {
        setAccordionIndexes(accordionIndex)
    }
    

    const onRecommendation = (recommendation : PossibleBook) => {
        setRecommendations(prevRecommendations => [...prevRecommendations, recommendation])
    }

    const failSearch = (title : string, description: string, statusType: "info" | "warning" | "success" | "error" | "loading" | undefined) => {
      setAccordionIndexes(accordionIndexes => accordionIndexes.filter(index => index !== 1))
        errorToast({
            title: title,
            description: description,
            status: statusType,
            duration: 9000,
            isClosable: true,
        })
    }

    useEffect( () => {
        if(searchStatus === SearchStatus.ERROR && recommendations.length === 0) {
        failSearch(
            'Search Failed',
            "Try again in a few minutes",
            'error')
        } else if(searchStatus === SearchStatus.MODERATION_ERROR && recommendations.length === 0) {
        failSearch(
            'Search Failed',
            "Blocked due to policy restrictions",
            'warning')
        }else if(searchStatus === SearchStatus.COMPLETE && recommendations.length === 0 ) {
        setAccordionIndexes(accordionIndexes => accordionIndexes.filter(index => index !== 1))
        failSearch('No Results Found',
            "Try a different search",
            'info')
        }
        
    }, [errorToast, recommendations, searchStatus])

    async function onSearch(description: string) {
        setAccordionIndexes(accordionIndexes => accordionIndexes.concat(1))
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
          onChange={onAccordionChange}
          allowMultiple
          index={accordionIndexes}
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