import { PossibleBook } from "../services/recommendations"
import BookResult from "./BookResult"
import LoadingIcon from "./LoadingIcon"
import { ListItem, OrderedList, UnorderedList, VStack } from '@chakra-ui/react'

interface BookResultListParams {
    results: PossibleBook[],
    isSearching: boolean
}
function BookResultList( { results, isSearching } : BookResultListParams) {
    if (isSearching) {
        return (<LoadingIcon/>)
    }
    if (results.length === 0) {
        return null
    }
    return ( 
        <VStack className ="book-results">
            <UnorderedList spacing={8}>
            { results.map((book : PossibleBook) => (
            <ListItem key={book.title} display="flex" >
                <BookResult result={book}/> 
            </ListItem>
            ))}
            </UnorderedList>
        </VStack>
        
    )
}

export default BookResultList