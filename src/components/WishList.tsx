import { PossibleBook } from "../services/recommendations"
import BookResult from "./BookResult"
import { ListItem, UnorderedList, VStack, Alert, AlertIcon, AlertTitle, AlertDescription, Flex, Spacer, Box, Center, Text} from '@chakra-ui/react'
import { useWishlist } from "../context/WishlistContext"
import BookDisplay from "./BookDisplay";
import { WishlistItem } from "../services/wishlist";

export default function WishList() {
    const { wishlist, wishlistError} = useWishlist();
    return ( 
        wishlistError === null ?
        (<VStack display="flex" height="100%" justifyContent="center" width="100%">
            {
                wishlist.length === 0 ? <Box flex="1">
                    <Center margin={4}>
                        <Text fontSize="xl" color="gray.500">Wishlist is Empty</Text>
                    </Center>
                    </Box>
                    
                :
                (
                    <UnorderedList spacing={8} width="100%">
                    { wishlist.map((wishlistItem : WishlistItem) => (
                    <ListItem key={wishlistItem.title} display="flex">
                        <BookDisplay title={wishlistItem.title}  author={wishlistItem.author} reason={wishlistItem.reason}/> 
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