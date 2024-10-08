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
  Button, 
  Container, 
  Flex, 
  Heading, 
  useToast} from '@chakra-ui/react';
import SearchDemo from './SearchDemo';
import React from 'react';
import { SearchStatus, useRecommendations } from '../context/RecommendationContext';
import { useAnalytics } from '../context/AnalyticsContext';
import { useLibrary } from '../context/LibraryContext';


const MemoSearchDemo = React.memo(() => (
    <SearchDemo/>
));

export default function SearchTab() {
    const {recommendations, 
      addRecommendation, 
      clearRecommendations, 
      searchStatus, 
      setSearchStatus, 
      currentSearch, 
      setCurrentSearch} = useRecommendations()
    const {trackAction} = useAnalytics()
    const {hasLibrary, openPopup} = useLibrary()
    const [accordionIndexes, setAccordionIndexes] = useState([0])
    const errorToast = useToast()
    const openResults = () => setAccordionIndexes(accordionIndexes => accordionIndexes.concat(1))

    useEffect(() => {
      if(recommendations.length !== 0) {
        openResults()
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const onAccordionChange = (accordionIndex: any) => {
        setAccordionIndexes(accordionIndex)
    }
  
    const onRecommendation = (recommendation : PossibleBook) => {
      addRecommendation(recommendation)
    }

    useEffect( () => {
      const closeResults = () => setAccordionIndexes(accordionIndexes => accordionIndexes.filter(index => index !== 1))
      const failSearch = (title : string, description: string, statusType: "info" | "warning" | "success" | "error" | "loading" | undefined) => {
          errorToast({
              title: title,
              description: description,
              status: statusType,
              duration: 9000,
              isClosable: true,
          })
      }
      if(searchStatus === SearchStatus.ERROR && recommendations.length === 0) {
        closeResults()
        failSearch(
          'Search Failed',
          "Try again in a few minutes",
          'error')
      } else if(searchStatus === SearchStatus.MODERATION_ERROR && recommendations.length === 0) {
        closeResults()
        failSearch(
          'Search Failed',
          "Blocked due to policy restrictions",
          'warning')
      } else if(searchStatus === SearchStatus.NO_RESULTS) {
        if(recommendations.length === 0) {
          closeResults()
        }
        failSearch('No Results Found',
          "Try a different search",
          'info')
      }
        
    }, [errorToast, recommendations, searchStatus])

    async function handleSearch(searchFunction: Function) {
      setSearchStatus(SearchStatus.SEARCHING);
      let recommendationsReceived = false;
      const checkForRecommendation = (book: PossibleBook) => {
        recommendationsReceived = true;
        onRecommendation(book);
      };
      try {
        await searchFunction(checkForRecommendation)
        if (!recommendationsReceived) {
          setSearchStatus(SearchStatus.NO_RESULTS);
        } else {
          setSearchStatus(SearchStatus.FINISHED);
        }
      } catch (error: any) {
        if (error.message === "MODERATION") {
          setSearchStatus(SearchStatus.MODERATION_ERROR);
        } else {
          setSearchStatus(SearchStatus.ERROR);
        }
      }
    }

    async function onSearch(description: string) {
      if(searchStatus === SearchStatus.SEARCHING) {
        return
      }
      trackAction("Search")
      openResults()
      setCurrentSearch(description)
      clearRecommendations()

      const searchFunction = (recommendationHandler : Function) => getRecommendationService().getRecommendationStream(description, recommendationHandler)
      await handleSearch(searchFunction)
    }

    const onAddResults = async (description : string, currentResults : PossibleBook[] ) => {
      if(searchStatus === SearchStatus.SEARCHING) {
        return
      }
      trackAction("Search Show More")
      const searchFunction = (recommendationHandler : Function) => getRecommendationService().getAdditionalRecommendations(description, currentResults, recommendationHandler);
      await handleSearch(searchFunction);
    }

    const hasMoreResults = () => {
      const SEARCH_RESULT_LIMIT = 20
      return searchStatus === SearchStatus.FINISHED && recommendations.length < SEARCH_RESULT_LIMIT
    }

    return (
    <Box flex="1">
      {hasLibrary ? <Button onClick={openPopup} fontSize={{base:"sm", md: "md"}}> 
      Change Library
      </Button> : ""}
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
              <BookResultList results={recommendations} 
              isSearching={searchStatus === SearchStatus.SEARCHING} 
              hasMoreResults={hasMoreResults()}
              currentSearch={currentSearch} 
              onAddResults={() => onAddResults(currentSearch, recommendations)}/>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Flex>
    </Box>)
  }