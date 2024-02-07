import { Button, Heading, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, VStack, Select, Link, Spacer } from "@chakra-ui/react";
import { useLibrary } from "../context/LibraryContext";
import { ChangeEvent, useState } from "react";

export default function ChooseLibrary() {
    const {isOpen, onClose, libraries, setLibrary} = useLibrary()
    const [chosenValue, setChosenValue] = useState<string>()

    const pickLibrary = () => {
        setLibrary(chosenValue || "")
        onClose()
    }

    const onChange = (event : ChangeEvent<HTMLSelectElement>) => {
        setChosenValue(event.target.value)
    }

    const email = process.env.REACT_APP_FEEDBACK_EMAIL
    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} size="sm">
                <ModalOverlay />
                <ModalContent minHeight="400px">
                    <ModalHeader>
                        <Heading textAlign="center" size={{base:"sm", sm: "md"}}>Choose Your Library</Heading>
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack>
                            <Select placeholder='Choose Your Library' onChange={onChange}>
                                {
                                    Object.entries(libraries).map(([libraryKey, libraryInfo], _) => 
                                        <option key={libraryKey} value={libraryKey}>{libraryInfo.name}</option>
                                        )
                                }
                            </Select>
                            <Spacer/>
                            <Heading fontWeight="normal" fontSize="md">Can't find your library?</Heading>
                                <Text fontWeight="light" fontSize="sm">
                                    <Link target="_blank" 
                                    href={`mailto:${email}?subject=FindMyRead Library Add`}>
                                        Send a request to add
                                    </Link>
                                </Text>
                        </VStack>
                    </ModalBody>
                    <ModalFooter>
                        <Button mr={3} onClick={onClose}>
                        Cancel
                        </Button>
                        <Button colorScheme='blue' mr={3} onClick={pickLibrary} >
                        Save
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};