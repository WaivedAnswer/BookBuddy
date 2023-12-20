import { HStack, IconButton, Text } from "@chakra-ui/react";
import { PossibleBook } from "../services/recommendations";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import { useWishlist } from "../context/WishlistContext";


interface WishlistActionParams {
    book: PossibleBook
}
export default function WishlistAction({book}: WishlistActionParams) {
    const { wishlist, handleAddToWishlist, handleRemoveFromWishlist } = useWishlist();

    const inList = wishlist.find(wishlistBook => book.title === wishlistBook.title) !== undefined

    const handleClick = (inList : boolean) => {
        if(inList) {
            handleRemoveFromWishlist(book)
        } else {
            handleAddToWishlist(book)
        }

    }
    return (
    <HStack>
      <Text fontWeight="bold" fontSize={{ base: "md", sm: "lg" }}>{inList ? "Remove From Wishlist" : "Add To Wishlist"}</Text>
      <IconButton aria-label={"favourite"} isRound onClick={() => handleClick(inList)}>
        { inList ? <MinusIcon/> : <AddIcon /> }
        </IconButton>
    </HStack>
    )
  }