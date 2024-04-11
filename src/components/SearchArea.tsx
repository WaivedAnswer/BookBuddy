import {useState, useRef, useEffect } from 'react';

import { Button, Container, Textarea, VStack } from '@chakra-ui/react';

interface SearchAreaParams {
    onSearch : Function;
}

function SearchArea({onSearch} : SearchAreaParams) {
    const searchTextRef = useRef<HTMLTextAreaElement>(null)
    const [description, setDescription] = useState("")

    const clearTextArea = () => {
        setDescription("");
    };
    
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
            <Textarea
            ref = {searchTextRef}
            className="description-text"
            placeholder="Describe the book you are looking for"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onKeyDown={handleKeyDown} 
            fontSize={{base: "md", sm:"lg"}}/>
    </Container>
        <Button size="lg" isDisabled={description.length === 0 } className="search-button" onClick={handleSubmit} colorScheme='blue'>
            Search
        </Button>
        <Button size="sm" isDisabled={description.length === 0 } className="clear-search-button" onClick={clearTextArea} colorScheme='gray'>
            Clear Search
        </Button>
    </VStack>
    )
  }

 export default SearchArea;