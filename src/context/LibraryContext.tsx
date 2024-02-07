import { useDisclosure } from '@chakra-ui/react';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { LibraryDictionary, getLibraryService } from '../services/libraryService';


interface LibraryContextParams {
   hasLibrary: boolean
   libraries: LibraryDictionary
   setLibrary: (libraryKey: string) => void
   isOpen: boolean
   openPopup: () => void
   onClose: () => void
}
const LibraryContext = createContext<null | LibraryContextParams> (null);


export const LibraryProvider = ({ children } : any) => {
    const [hasLibrary, setHasLibrary] = useState<boolean>(false)
    const [libraries, setLibraries] = useState<LibraryDictionary>({})
    const { isOpen, onOpen, onClose } = useDisclosure()

    useEffect(() => {
        async function loadLibraryState() {
            const initialHasLibrary = await getLibraryService().hasLibrary()
            setHasLibrary(initialHasLibrary)
        }
        loadLibraryState()
    }, [])

    const openPopup = useCallback(async () => {
        onOpen()
        const libraryResults = await getLibraryService().getLibraries()
        setLibraries(libraryResults)
    }, [onOpen])

    const setLibrary = useCallback(async (libraryKey: string) => {
        await getLibraryService().setLibrary(libraryKey)
        const newHasLibrary = await getLibraryService().hasLibrary()
        setHasLibrary(newHasLibrary)
    }, [])

    return (
        <LibraryContext.Provider value={{hasLibrary, isOpen, openPopup, onClose, libraries, setLibrary}}>
        {children}
        </LibraryContext.Provider>
    );
};

export const useLibrary = () => {
  const context = useContext(LibraryContext);
  if (context === null) {
    throw new Error('useLibrary must be used within a Library Provider');
  }
  return context;
};