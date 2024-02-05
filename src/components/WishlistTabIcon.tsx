import { Spinner, Text } from "@chakra-ui/react";
import { useWishlist } from "../context/WishlistContext";
import { WarningIcon } from "@chakra-ui/icons";

export default function WishlistTabIcon() {
    const {wishlist, wishlistError, isLoading} = useWishlist()
    if(wishlistError) {
        return ( <WarningIcon color="orange.400" boxSize={5}/> )
    } else if(isLoading) {
        return (<Spinner size="sm"/>)
    } else {
        const wishlistDisplayCount = wishlist.length ? ` (${wishlist.length})` : ""
        return (<Text size="md">{ wishlistDisplayCount } </Text>)
    }
}