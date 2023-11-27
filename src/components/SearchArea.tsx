import {useState, useRef, useEffect } from 'react';

import { Button, Container, Textarea, VStack } from '@chakra-ui/react';

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
    const handleSubmit = (e: any) => {
        e.preventDefault();
        onSearch(description);
    }

    const handleKeyDown = (e: any) => {
        if (e.key === 'Enter' && !e.shiftKey) { // Check for Enter key and that Shift is not pressed
            e.preventDefault(); // Prevents the default action (new line)
            onSearch(description); // Calls the submit function
        }
    };

    return (
    <VStack className="search-area" justify="center">
        <Container>
            <Textarea
            ref = {searchTextRef}
            className="description-text"
            placeholder="What are you looking for?"
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