import { Text } from "@chakra-ui/react";
import { useWishlist } from "../context/WishlistContext";

export default function WishlistTabTitle() {
    const {wishlist} = useWishlist()
    const wishlistDisplayCount = wishlist.length ? ` (${wishlist.length})` : ""
    return (
    <Text size="md">{"Wishlist" + wishlistDisplayCount} </Text>
    )
}