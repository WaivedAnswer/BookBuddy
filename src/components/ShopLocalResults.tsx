import { Button, Divider, HStack, Heading, Input, ListItem, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, Spinner, UnorderedList, VStack, useDisclosure, Box } from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import ShopResult from "./ShopResult";
import { useLocation } from "../context/LocationContext";
import LoadingIcon from "./LoadingIcon";
import { ShopResultParams, getLocalBookService } from "../services/localResults";

interface ShopLocalResultsParams {
    isOpen: boolean
    onClose: () => void
    isbn: string | null
}

enum LocationStatus {
    PENDING,
    SUCCESS,
    DENIED
}

enum LoadingStatus {
    IDLE,
    SEARCHING,
    COMPLETE
}


export default function ShopLocalResults({isOpen, onClose, isbn} : ShopLocalResultsParams) {
    const [postal, setPostal] = useState<string>("")
    const [locationStatus, setLocationStatus] = useState<LocationStatus>(LocationStatus.PENDING)
    const [results, setResults] = useState<ShopResultParams[]>([])
    const [loadingStatus, setLoadingStatus] = useState<LoadingStatus>(LoadingStatus.IDLE)
    const {fetchLocation } = useLocation()
    const handleChange = (event : any) => setPostal(event.target.value)

    const searchResults = useCallback(async (longitude: number | null, latitude: number | null) => {
        setLoadingStatus(LoadingStatus.SEARCHING)
        try {
            const results = await getLocalBookService().searchResults(longitude, latitude, isbn, postal)
            setResults(results)
        } catch(error) {
            console.error(error)
            setResults([])
        } finally {
            setLoadingStatus(LoadingStatus.COMPLETE)
        }
    }, [isbn, postal])

    useEffect(()=> {
        if(!isOpen) {
            return;
        }
        async function loadResults() {
            try {
                const {longitude, latitude} = await fetchLocation()
                setLocationStatus(LocationStatus.SUCCESS)
                await searchResults(longitude, latitude)
            } catch (error) {
                setLocationStatus(LocationStatus.DENIED)
            }
        }
        loadResults()
    }, [fetchLocation, isOpen, searchResults])

    const handleKeyDown = (event: any) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            searchResults(null, null);
        }
    };


    const clearResultsOnClose = () => {
        setResults([])
        setLocationStatus(LocationStatus.PENDING)
        setLoadingStatus(LoadingStatus.IDLE)
        onClose()
    }
    
    return (
        <>

            <Modal isOpen={isOpen} onClose={clearResultsOnClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader><Heading size={{base:"sm", sm: "md"}}>Support Independent Bookstores</Heading></ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack height="100%">
                            {locationStatus === LocationStatus.SUCCESS ? "" : 
                                locationStatus === LocationStatus.PENDING ? <HStack>
                                    <Text>Fetching Location</Text>
                                    <Spinner size="sm"></Spinner>
                                    </HStack> :
                            <HStack>
                                <Input placeholder="Postal Code" 
                                value={postal} 
                                onChange={handleChange} 
                                onKeyDown={handleKeyDown} 
                                width={36}></Input>
                                <Button onClick={() => searchResults(null, null)}>Search</Button>
                            </HStack>
                            }
                            <Divider/>
                            <VStack height="100%" width="100%" margin={4}>
                                {loadingStatus === LoadingStatus.IDLE ? "" :
                                loadingStatus === LoadingStatus.COMPLETE ? 
                                
                                (<>
                                    <Heading fontSize="lg">{`Local Results`}</Heading>
                                    <UnorderedList spacing={4} listStyleType="none">
                                        {
                                        results.map((result : ShopResultParams) => 
                                        (<ListItem key={result.san}>
                                            <ShopResult result={result}/>
                                        </ListItem>)
                                        )}
                                    </UnorderedList>
                                </>) :
                                <LoadingIcon/>
                                }
                            </VStack>
                            
                        </VStack>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={onClose}>
                        Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};