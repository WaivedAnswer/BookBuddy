import {useState, useRef, useEffect } from 'react';

import { Button, Container, HStack, Heading, IconButton, ListItem, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger, Textarea, Text, UnorderedList, VStack } from '@chakra-ui/react';
import { InfoIcon } from '@chakra-ui/icons';

interface SearchAreaParams {
    onSearch : Function;
}

function SearchArea({onSearch} : SearchAreaParams) {
    const searchTextRef = useRef<HTMLTextAreaElement>(null)
    const [description, setDescription] = useState("")
    
    useEffect(() => {
        const timer = setTimeout(() => {
            if(searchTextRef.current) {
                searchTextRef.current.focus()
            }
          }, 500); 
      
          return () => clearTimeout(timer); // Cleanup on unmount
        
    }, [])

    const search = (description: string) => {
        searchTextRef.current?.blur()
        onSearch(description)
    }
    const handleSubmit = (e: any) => {
        e.preventDefault();
        search(description);
    }

    const handleKeyDown = (event: any) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            search(description);
        }
    };

    return (
    <VStack className="search-area" justify="center">
        <Container>
            <HStack justify="center" >
                <Heading fontSize="md" margin={2}>Description</Heading>
                <Popover placement="bottom">
                    <PopoverTrigger>
                        <IconButton
                            aria-label="Description Examples"
                            icon={<InfoIcon />}
                            isRound={true}
                            size="sm"
                            variant="outline"
                        />
                    </PopoverTrigger>
                    <PopoverContent>
                    <PopoverArrow />
    <PopoverCloseButton />
    <PopoverHeader>Description Criteria</PopoverHeader>
    <PopoverBody>
                    <Text>You can make your search as simple or complex as you like. For example:</Text>
                        <UnorderedList>
                            <ListItem>I want great books on cooking</ListItem>
                            <ListItem>I am looking for a gripping mystery novel with a strong female detective</ListItem>
                            <ListItem>I am looking for a motivational book that blends self-help with practical career advice, like Atomic Habits</ListItem>
                        </UnorderedList>
    </PopoverBody>
                        
                        
                    </PopoverContent>
                </Popover>
            </HStack>
            <Textarea
            ref = {searchTextRef}
            className="description-text"
            placeholder="Describe the book you are looking for"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onKeyDown={handleKeyDown} />
    </Container>
      <Button className="search-button" onClick={handleSubmit} colorScheme='blue'>
        Search
      </Button>
    </VStack>
    )
  }

 export default SearchArea;