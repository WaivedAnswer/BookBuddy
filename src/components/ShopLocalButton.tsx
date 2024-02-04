import { Button, useDisclosure } from "@chakra-ui/react";
import ShopLocalResults from "./ShopLocalResults";

interface ShopLocalParams {
    isbn: string | null
    title: string
  }

export default function ShopLocalButton({isbn, title} : ShopLocalParams) {
    const { isOpen, onOpen, onClose } = useDisclosure()

    const onClick = async () => {
            onOpen()
    }
    
    return (
        <>
            <Button onClick={onClick}>
            Shop Local
            </Button>
            <ShopLocalResults isOpen={isOpen} onClose={onClose} isbn={isbn} title={title}/>
        </>
    );
};