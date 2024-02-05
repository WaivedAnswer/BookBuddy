import { Button, useDisclosure } from "@chakra-ui/react";
import ShopLocalResults from "./ShopLocalResults";
import { useAnalytics } from "../context/AnalyticsContext";

interface ShopLocalParams {
    isbn: string | null
  }

export default function ShopLocalButton({isbn} : ShopLocalParams) {
    const {trackAction} = useAnalytics()
    const { isOpen, onOpen, onClose } = useDisclosure()

    const onClick = async () => {
            onOpen()
            trackAction("Shop Local Click")
    }
    
    return (
        <>
            <Button 
            bgColor="midnightblue" 
            color="white" 
            borderRadius="full"
            onClick={onClick}>
            Local Stores
            </Button>
            <ShopLocalResults isOpen={isOpen} onClose={onClose} isbn={isbn}/>
        </>
    );
};