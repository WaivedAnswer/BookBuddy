import { PossibleBook } from "../services/recommendations"
import img from "../images/book-cover.png"
import {AspectRatio, Flex, Heading, Image, Link, Text } from "@chakra-ui/react"
import { ExternalLinkIcon } from '@chakra-ui/icons'
import BookReason from "./BookReason"

interface BookResultParams {
  result: PossibleBook,
  currentSearch: string,
}
function BookResult( { result, currentSearch } : BookResultParams) {
  const amazonLink = "https://www.amazon.ca/s?k=" + result.title.replace(" ", "+")
  return ( 

      <Flex 
      direction={{ base: "column", sm: "row" }} 
      className="book-result" 
      width="100%">
      <AspectRatio ratio={1 / 1} width={{ base: "90%", sm: "100%", md: "70%" }} flex="1">
        <Image alt="placeholder book cover" src={img} objectFit="cover"/>
      </AspectRatio>
    
      <Flex direction="column" p={4} flex="3">
        <Link href={amazonLink} target="_blank" rel="noreferrer" isExternal>
          <Heading size="md">{result.title} <ExternalLinkIcon mx='2px' /></Heading>
        </Link>
        <BookReason book={result} currentSearch={currentSearch}/>
      </Flex>
    </Flex>
  )
}

export default BookResult