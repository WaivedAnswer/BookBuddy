import { Button, Divider, HStack, Heading, Input, ListItem, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, Spinner, UnorderedList, VStack, useDisclosure, Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import ShopResult, { ShopResultParams } from "./ShopResult";
import { useLocation } from "../context/LocationContext";
import LoadingIcon from "./LoadingIcon";

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
    }, [isOpen])

    const handleKeyDown = (event: any) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            searchResults(null, null);
        }
    };

    const searchResults = async (longitude: number | null, latitude: number | null) => {
        setLoadingStatus(LoadingStatus.SEARCHING)
        try {
            await new Promise(r => setTimeout(r, 3000));
            let body = new FormData();
            body.append("api_key", "5YKqfETqdBbDihZZEozM65k8jmeXs9tR")
            if(isbn) {
                body.append("isbn", isbn)
            }
            body.append("distance_km", "100")

            if(longitude && latitude) {
                body.append("latitude", latitude.toString())
                body.append("longitude", longitude.toString())
            } else {
                body.append("postal", postal)
            }
    
            fetch("https://api.bookmanager.com/tbm/nearbyStores/get", {
                    method: "POST",
                    body: body
                }).then((function(e) {
                    return e.json()
                })).then(result => {
                    if(result.error) {
                        console.error(`Failed ${JSON.stringify(result)}`)
                        setResults([])
                    } else {
                        setResults(result.rows)
                    }
                }).catch((function() {
                    console.error("Failed to get local stores")
                }))
        } catch(error) {
            console.error(error)
            return
        } finally {
            setLoadingStatus(LoadingStatus.COMPLETE)
        }
    }

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
                    <ModalHeader><Heading size="md">Support Independent Bookstores</Heading></ModalHeader>
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