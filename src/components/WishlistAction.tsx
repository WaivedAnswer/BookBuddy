import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button, HStack, IconButton, Spinner, Text, useDisclosure, useToast } from "@chakra-ui/react";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import { useWishlist } from "../context/WishlistContext";
import { WishlistItem } from "../services/wishlist";
import React, { useEffect, useState } from "react";
import { useAnalytics } from "../context/AnalyticsContext";


interface WishlistActionParams {
    item: WishlistItem
}

export default function WishlistAction({item}: WishlistActionParams) {
    const { trackAction } = useAnalytics()
    const { wishlist, handleAddToWishlist, handleRemoveFromWishlist } = useWishlist();
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [ wishlistItem, setWishlistItem] = useState<WishlistItem | undefined >()
    const [ inProgress, setInProgress] = useState<boolean>(false)
    const cancelRef = React.useRef(null)
    const errorToast = useToast()
    useEffect(() => { 
        const matchingItem = wishlist.find(wishlistBook => item.title === wishlistBook.title)
        setWishlistItem(matchingItem)
    }, [item, wishlist])

    const inList = wishlistItem !== undefined

    const handleDelete = async () => {
        try {
            setInProgress(true)
            onClose()
            if(!wishlistItem?.itemId) {
                throw new Error("Item not in wishlist")
            }
            trackAction("Wishlist Remove")
            const success = await handleRemoveFromWishlist(wishlistItem.itemId)
            if(!success) {
                errorToast({
                    title: 'Remove Failed',
                    description: "Try again in a few minutes",
                    status: 'error',
                    duration: 9000,
                    isClosable: true,
                })
            }
        } catch (error) {
            
        } finally {
            setInProgress(false)
        }
    }

    const handleClick = async (inList : boolean) => {
        if(inList) {
            onOpen()
        } else {
            try {
                setInProgress(true)
                trackAction("Wishlist Add")
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
            } catch (error) {
                console.error(error)
            } finally {
                setInProgress(false)
            }
        }

    }
    return (
        <>
        <HStack >
            <Text fontWeight="bold" fontSize={{ base: "md", sm: "lg" }}>{inList ? "Remove From Wishlist" : "Add To Wishlist"}</Text>
            {inProgress ? <Spinner/>  : (<IconButton aria-label={"favourite"} isRound onClick={() => handleClick(inList)}>
                { inList ? <MinusIcon/> : <AddIcon /> }
            </IconButton>) }
            
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