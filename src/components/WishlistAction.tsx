import { HStack, IconButton, Text, useToast } from "@chakra-ui/react";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import { useWishlist } from "../context/WishlistContext";
import { WishlistItem } from "../services/wishlist";


interface WishlistActionParams {
    item: WishlistItem
}
export default function WishlistAction({item}: WishlistActionParams) {
    const { wishlist, handleAddToWishlist, handleRemoveFromWishlist } = useWishlist();
    const errorToast = useToast()

    const inList = wishlist.find(wishlistBook => item.title === wishlistBook.title) !== undefined

    const handleClick = async (inList : boolean) => {
        if(inList) {
            const success = await handleRemoveFromWishlist(item)
            if(!success) {
                errorToast({
                    title: 'Remove Failed',
                    description: "Try again in a few minutes",
                    status: 'error',
                    duration: 9000,
                    isClosable: true,
                })
            }
        } else {
            const success = await handleAddToWishlist(item)
            if(!success) {
                errorToast({
                    title: 'Add Failed',
                    description: "Try again in a few minutes",
                    status: 'error',
                    duration: 9000,
                    isClosable: true,
                })
            }

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