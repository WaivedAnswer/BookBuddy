import { PossibleBook } from "../services/recommendations"
import BookResult from "./BookResult"
import LoadingIcon from "./LoadingIcon"
import { Box, ListItem, UnorderedList, VStack,Text, Button} from '@chakra-ui/react'

interface BookResultListParams {
    results: PossibleBook[],
    isSearching: boolean,
    hasMoreResults: boolean,
    currentSearch: string,
    onAddResults: () => void,
}
function BookResultList( { results, isSearching, currentSearch, onAddResults, hasMoreResults } : BookResultListParams) {
    return ( 
        <VStack display="flex" justifyContent="center" width="100%">
            {
                results.length === 0 ? "" :
                (
                    <UnorderedList spacing={8} width="100%">
                    { results.map((book : PossibleBook) => (
                    <ListItem key={book.title} display="flex">
                        <BookResult result={book} currentSearch={currentSearch} /> 
                    </ListItem>
                    ))}
                    </UnorderedList>
                )
            }
            {isSearching ? <LoadingIcon/> : (
                hasMoreResults ? (<Button size="lg" colorScheme="blue" mt={4} mb={8} onClick={onAddResults}>Show More</Button>)
                : "")}
            <Box textAlign="center" width="100%">
                <Text size="xs" fontWeight="light" fontStyle="italic">* As an Amazon Associate I earn from qualifying purchases *</Text>
            </Box>
        </VStack>
        
    )
}

export default BookResultList