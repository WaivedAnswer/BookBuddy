import { PossibleBook } from "../services/recommendations"
import BookResult from "./BookResult"
import { ListItem, UnorderedList, VStack} from '@chakra-ui/react'
import { useWishlist } from "../context/WishlistContext"

export default function WishList() {
    const { wishlist} = useWishlist();
    return ( 
        <VStack display="flex" justifyContent="center" width="100%">
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
        </VStack>
        
    )
}