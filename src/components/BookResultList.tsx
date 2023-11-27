import { PossibleBook } from "../services/recommendations"
import BookResult from "./BookResult"
import LoadingIcon from "./LoadingIcon"
import { ListItem, OrderedList, VStack } from '@chakra-ui/react'

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
            <OrderedList>
            { results.map((book : PossibleBook) => (
            <ListItem key={book.title}>
                <BookResult result={book}/> 
            </ListItem>
            ))}
            </OrderedList>
        </VStack>
        
    )
}

export default BookResultList