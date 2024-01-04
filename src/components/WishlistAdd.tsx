import { HStack, IconButton, Spinner, Text } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";


interface WishlistAddParams {
    handleAdd: Function
    inProgress: boolean
}

export default function WishlistAdd({handleAdd, inProgress}: WishlistAddParams) {
    return (
        <>
        <HStack >
            <Text fontWeight="bold" fontSize={{ base: "md", sm: "lg" }}>{"Add To Wishlist"}</Text>
            {inProgress ? <Spinner/>  : (<IconButton aria-label={"favourite"} isRound onClick={() => handleAdd()}>
                 <AddIcon />
            </IconButton>) }
        </HStack>
        </>
    )
  }