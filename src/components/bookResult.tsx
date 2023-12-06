import { PossibleBook } from "../services/recommendations"
import img from "../images/book-cover.png"
import {AspectRatio, Box, Button, Card, CardBody, CardFooter, CardHeader, Flex, HStack, Heading, Image, Spinner, Text } from "@chakra-ui/react"
import BookReason from "./BookReason"
import { AmazonBestSellerLinkGenerator, getFixedLink, getLinkGenerationService } from "../services/linkGenerations"
import { useEffect, useState } from "react"

interface BookResultParams {
  result: PossibleBook,
  currentSearch: string,
}
function BookResult( { result, currentSearch } : BookResultParams) {
  const [link, setLink] = useState<string | null>(null)
  useEffect(() => {
    async function generateLink() {
      const linkService = getLinkGenerationService()
      try {
        const newLink = await linkService.generateLink(result.title, result.author)
        setLink(newLink)
      }
      catch(err) {
        setLink(getFixedLink(result.title))
      }
    }
    generateLink()
  },[result])

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
          {
            link ? <Button as="a" href={link} target="_blank" rel="noreferrer" bgColor="midnightblue" color="white" borderRadius="full">Amazon</Button> :
            <Spinner/>
          }
        </HStack>
      </CardFooter>
    </Card>
  )
}

export default BookResult