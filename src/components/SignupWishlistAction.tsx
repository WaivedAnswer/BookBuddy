import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button, useDisclosure } from "@chakra-ui/react";
import WishlistAdd from "./WishlistAdd";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function SignupWishlistAction() {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const cancelRef = React.useRef(null)
    const navigate = useNavigate()

    const handleSignup = async () => {
        try {
            onClose()
            navigate("/signup")
        } catch (error) {
        } finally {
        }
    }

    const handleAdd = async () => {
        onOpen()
    }

    return (
        <>
            <WishlistAdd handleAdd={handleAdd} inProgress={false}/>
            <AlertDialog
            isOpen={isOpen}
            leastDestructiveRef={cancelRef}
            onClose={onClose}
            >
                <AlertDialogOverlay>
                <AlertDialogContent>
                    <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                    Sign Up
                    </AlertDialogHeader>

                    <AlertDialogBody>
                    Sign up and save books to your wishlist
                    </AlertDialogBody>

                    <AlertDialogFooter>
                    <Button ref={cancelRef} onClick={onClose}>
                        Cancel
                    </Button>
                    <Button colorScheme='blue' onClick={handleSignup} ml={3}>
                        Sign up
                    </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    )
  }