import { PossibleBook } from "../services/recommendations"
import BookResult from "./BookResult"
import LoadingIcon from "./LoadingIcon"
import { ListItem, UnorderedList, VStack } from '@chakra-ui/react'

interface BookResultListParams {
    results: PossibleBook[],
    isSearching: boolean
}
function BookResultList( { results, isSearching } : BookResultListParams) {
    return ( 
        <VStack className ="book-results" display="flex" justifyContent="center">
            {
                results.length === 0 ? "" :
                (//TODO make list span 100% of width
                    <UnorderedList spacing={8} >
                    { results.map((book : PossibleBook) => (
                    <ListItem key={book.title} display="flex" width="600px">
                        <BookResult result={book}/> 
                    </ListItem>
                    ))}
                    </UnorderedList>
                )
            }
            {isSearching ? <LoadingIcon/> : ""}
        </VStack>
        
    )
}

export default BookResultList