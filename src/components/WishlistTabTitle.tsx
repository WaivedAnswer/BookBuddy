import { HStack, Text } from "@chakra-ui/react";
import WishlistTabIcon from "./WishlistTabIcon";

export default function WishlistTabTitle() {
    return (
    <HStack>
        <Text size="md">{"Wishlist"} </Text>
        <WishlistTabIcon/> 
    </HStack>
    )
}