import { PossibleBook } from "../services/recommendations"
import img from "../images/book-cover.png"
import {AspectRatio, Box, Button, Card, CardBody, CardFooter, CardHeader, Flex, HStack, Heading, Image, Text } from "@chakra-ui/react"
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
      size="sm"
      variant="outline"
      direction={{ base: "column" }} 
      className="book-result" 
      width="100%">
      <CardHeader>
        <Heading size={{base:"lg", sm:"md", lg:"lg"}}>{result.title}</Heading>
      </CardHeader>
      <CardBody>
        <Flex direction={{base: "column", sm: "row"}} gap={{base:4, md:8}}>
          <AspectRatio ratio={1 / 1} width={{base:"90%", sm:"100%"}} flex="1" >
            <Image alt="placeholder book cover" src={img} objectFit="cover"/>
          </AspectRatio>
          <Box flex="3">
            <BookReason book={result} currentSearch={currentSearch}/>
          </Box>
        </Flex>
      </CardBody>
      
      <CardFooter>
        <HStack>
          <Text size="md" as="b">View on:</Text>
          <Button as="a" href={amazonLink} target="_blank" rel="noreferrer" bgColor="midnightblue" color="white" borderRadius="full">Amazon</Button>
        </HStack>
      </CardFooter>
    </Card>
  )
}

export default BookResult