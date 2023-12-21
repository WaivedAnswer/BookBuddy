import { HStack, Text } from "@chakra-ui/react";
import { useWishlist } from "../context/WishlistContext";
import { WarningIcon } from "@chakra-ui/icons";

export default function WishlistTabTitle() {
    const {wishlist, wishlistError} = useWishlist()
    const wishlistDisplayCount = wishlist.length ? ` (${wishlist.length})` : ""
    return (
    <HStack>
        <Text size="md">{"Wishlist"} </Text>
        {wishlistError === null ?
        <Text size="md">{ wishlistDisplayCount } </Text> :
        <WarningIcon color="orange.400" boxSize={5}/>}
        
    </HStack>
    )
}