import { PossibleBook } from "../services/recommendations"
import img from "../images/book-cover.png"
import {AspectRatio, Button, Card, Flex, HStack, Heading, Image, Text } from "@chakra-ui/react"
import { ExternalLinkIcon } from '@chakra-ui/icons'
import BookReason from "./BookReason"

interface BookResultParams {
  result: PossibleBook,
  currentSearch: string,
}
function BookResult( { result, currentSearch } : BookResultParams) {
  const amazonLink = "https://www.amazon.ca/s?k=" + result.title.replace(" ", "+")
  return ( 

    <Card 
    padding={4}
      direction={{ base: "column", sm: "row" }} 
      className="book-result" 
      width="100%">
      <AspectRatio ratio={1 / 1} width={{ base: "90%", sm: "100%", md: "70%" }} flex="1">
        <Image alt="placeholder book cover" src={img} objectFit="cover"/>
      </AspectRatio>
    
      <Flex direction="column" p={4} flex="3" justify="space-between" gap={4}>
        <Heading size="lg">{result.title}</Heading>
        <BookReason book={result} currentSearch={currentSearch}/>
        <HStack>
          <Text size="md" as="b">View on:</Text>
          <Button as="a" href={amazonLink} target="_blank" rel="noreferrer" bgColor="midnightblue" color="white" borderRadius="full">Amazon<ExternalLinkIcon/></Button>
        </HStack>
      </Flex>
    </Card>
  )
}

export default BookResult