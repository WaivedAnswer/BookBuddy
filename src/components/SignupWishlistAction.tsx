import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button, useDisclosure } from "@chakra-ui/react";
import WishlistAdd from "./WishlistAdd";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAnalytics } from "../context/AnalyticsContext";

export default function SignupWishlistAction() {
    const {trackAction} = useAnalytics()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const cancelRef = React.useRef(null)
    const navigate = useNavigate()

    const handleSignup = async () => {
        trackAction("Offline Add Signup")
        onClose()
        navigate("/signup")
    }

    const handleLogin = async () => {
        onClose()
        navigate("/login")
    }

    const handleAdd = async () => {
        trackAction("Offline Add Action")
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
                    Account Required
                    </AlertDialogHeader>
                    <AlertDialogBody>
                    Log in or Sign up to save books to your wishlist
                    </AlertDialogBody>
                    <AlertDialogFooter>
                    <Button ref={cancelRef} onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleLogin} ml={3}>
                        Log in
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