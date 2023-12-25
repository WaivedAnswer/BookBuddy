import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button, HStack, IconButton, Text, useDisclosure, useToast } from "@chakra-ui/react";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import { useWishlist } from "../context/WishlistContext";
import { WishlistItem } from "../services/wishlist";
import React from "react";


interface WishlistActionParams {
    item: WishlistItem
}
export default function WishlistAction({item}: WishlistActionParams) {
    const { wishlist, handleAddToWishlist, handleRemoveFromWishlist } = useWishlist();
    const { isOpen, onOpen, onClose } = useDisclosure()
    const cancelRef = React.useRef(null)
    const errorToast = useToast()


    const inList = wishlist.find(wishlistBook => item.title === wishlistBook.title) !== undefined

    const handleDelete = async () => {
        onClose()
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
    }

    const handleClick = async (inList : boolean) => {
        if(inList) {
            onOpen()
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
        <>
        <HStack >
            <Text fontWeight="bold" fontSize={{ base: "md", sm: "lg" }}>{inList ? "Remove From Wishlist" : "Add To Wishlist"}</Text>
            <IconButton aria-label={"favourite"} isRound onClick={() => handleClick(inList)}>
                { inList ? <MinusIcon/> : <AddIcon /> }
                </IconButton>
        </HStack>
        <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              Remove From Wishlist
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You can't undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme='red' onClick={handleDelete} ml={3}>
                Remove
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
        </>
    
    )
  }