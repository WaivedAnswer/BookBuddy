import { useEffect, useState } from "react"
import { PossibleBook } from "../services/recommendations"
import { getWishlistService } from "../services/wishlist"
import BookResult from "./BookResult"
import { ListItem, UnorderedList, VStack} from '@chakra-ui/react'

export default function WishList() {
    const [results, setResults] = useState<PossibleBook[]>([])
    useEffect(()=> {
        async function fetchWishlist() {
            const result = await getWishlistService().getWishlist()
            setResults(result)
        } 
        fetchWishlist()
    }, [])
    
    return ( 
        <VStack display="flex" justifyContent="center" width="100%">
            {
                results.length === 0 ? "" :
                (
                    <UnorderedList spacing={8} width="100%">
                    { results.map((book : PossibleBook) => (
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