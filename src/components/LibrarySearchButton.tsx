import { ChangeEvent, useEffect, useState } from "react";
import { useAnalytics } from "../context/AnalyticsContext";
import { LibraryDictionary, LibraryInfo, getLibraryService } from "../services/libraryService";
import { Button, Divider, HStack, Heading, Input, ListItem, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, Spinner, UnorderedList, VStack, useDisclosure, Box, Select, Container, Link, Spacer } from "@chakra-ui/react";


interface LibraryParams {
    title: string
  }

export default function LibrarySearchButton({title} : LibraryParams) {
    const {trackAction} = useAnalytics()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [libraries, setLibraries] = useState<LibraryDictionary>({})

    useEffect(() => {
        async function fetchLibraries() {
            const libraryList = await getLibraryService().getLibraries()
            setLibraries(libraryList)
        }
        fetchLibraries()
    }, [])

    const searchLibrary = async () => {
        const link = await getLibraryService().getLink(title)
        const newWindow = window.open(link, '_blank', 'noopener,noreferrer')
        if (newWindow) newWindow.opener = null
    }

    const onChange = async (e: ChangeEvent<HTMLSelectElement>) => {
        getLibraryService().setLibrary(e.target.value)
    }


    const onClick = async () => {
        trackAction("Library Click")
        const libraryService = getLibraryService()
        const hasLibrary = await libraryService.hasLibrary()
        if(!hasLibrary) {
            onOpen()
        } else {
            await searchLibrary()
        }
    }
    
    return (
        <>
            <Button 
            bgColor="midnightblue" 
            color="white" 
            borderRadius="full"
            onClick={onClick}>
            My Library
            </Button>
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
                                    <Text as="span">Send a </Text>
                                    <Link>request</Link>
                                    <Text as="span"> to add</Text>
                                </Text>
                        </VStack>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={onClose}>
                        Close
                        </Button>
                        <Button colorScheme='blue' mr={3} onClick={() => {searchLibrary(); onClose();}}>
                        Search
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};