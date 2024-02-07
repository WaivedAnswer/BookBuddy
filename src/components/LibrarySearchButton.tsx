import { useAnalytics } from "../context/AnalyticsContext";
import { getLibraryService } from "../services/libraryService";
import { Button } from "@chakra-ui/react";
import { useLibrary } from "../context/LibraryContext";

interface LibraryParams {
    title: string
  }

export default function LibrarySearchButton({title} : LibraryParams) {
    const {trackAction} = useAnalytics()
    const {hasLibrary, openPopup} = useLibrary()

    const searchLibrary = async () => {
        const link = await getLibraryService().getLink(title)
        const newWindow = window.open(link, '_blank', 'noopener,noreferrer')
        if (newWindow) newWindow.opener = null
    }

    const onClick = async () => {
        trackAction("Library Click")
        if(!hasLibrary) {
            openPopup()
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
        </>
    );
};