import { PossibleBook } from "../services/recommendations"
import BookResult from "./BookResult"
import LoadingIcon from "./LoadingIcon"
import { Box, ListItem, UnorderedList, VStack,Text} from '@chakra-ui/react'

interface BookResultListParams {
    results: PossibleBook[],
    isSearching: boolean,
    currentSearch: string,
}
function BookResultList( { results, isSearching, currentSearch } : BookResultListParams) {
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
            {isSearching ? <LoadingIcon/> : ""}
            <Box textAlign="center" width="100%">
                <Text size="xs" fontWeight="light" fontStyle="italic">* As an Amazon Associate I earn from qualifying purchases *</Text>
            </Box>
        </VStack>
        
    )
}

export default BookResultList