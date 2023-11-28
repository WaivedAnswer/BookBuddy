import { PossibleBook } from "../services/recommendations"
import img from "../images/book-cover.png"
import {Card, Container, Heading, Image, Link, Text } from "@chakra-ui/react"
import { ExternalLinkIcon } from '@chakra-ui/icons'

interface BookResultParams {
    result: PossibleBook
}
function BookResult( { result } : BookResultParams) {

   const amazonLink = "https://www.amazon.ca/s?k=" + result.title.replace(" ", "+")
    return ( 
    <Card className="book-result" direction="row">
        <Image alt="placeholder book cover" src={img} className="book-thumbnail" boxSize="xs"/>
        <div className="result-info">
            <Link href={amazonLink} target="_blank" rel="noreferrer" isExternal>
                <Heading>{result.title} <ExternalLinkIcon mx='2px' /></Heading> 
            </Link>
            <Text fontSize="xl">{result.reason}</Text>

        </div>
        
    </Card>
    )
}

export default BookResult