import { PossibleBook } from "../services/recommendations"
import BookResult from "./BookResult"
import { ListItem, UnorderedList, VStack, Alert, AlertIcon, AlertTitle, AlertDescription, Flex, Spacer} from '@chakra-ui/react'
import { useWishlist } from "../context/WishlistContext"

export default function WishList() {
    const { wishlist, wishlistError} = useWishlist();
    return ( 
        wishlistError === null ?
        (<VStack display="flex" justifyContent="center" width="100%">
            {
                wishlist.length === 0 ? "" :
                (
                    <UnorderedList spacing={8} width="100%">
                    { wishlist.map((book : PossibleBook) => (
                    <ListItem key={book.title} display="flex">
                        <BookResult result={book} currentSearch={""} /> 
                    </ListItem>
                    ))}
                    </UnorderedList>
                )
            }
        </VStack>) :
        (
            <Flex direction="column" flex="1" justify="space-around">
                <Alert status='error'
                  alignItems='center'
                  justifyContent='center'
                  textAlign='center'
                  height='200px'
                  flexDirection='column'
                  >
                    <AlertIcon boxSize='40px'/>
                    <AlertTitle mt={2}>Failed to Load Wishlist</AlertTitle>
                    <AlertDescription>Try again later</AlertDescription>
                </Alert>
            </Flex>
        )

        
    )
}