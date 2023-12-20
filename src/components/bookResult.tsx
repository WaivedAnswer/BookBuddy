import { PossibleBook } from "../services/recommendations"
import placeholderImage from "../images/book-cover-placeholder.png"
import {Button, Card, CardBody, CardFooter, CardHeader, Flex, HStack, Heading, IconButton, Image, Skeleton, Spacer, Spinner, Text, VStack } from "@chakra-ui/react"
import BookReason from "./BookReason"
import { getFixedLink, getLinkGenerationService } from "../services/linkGenerations"
import { useEffect, useState } from "react"
import { AddIcon } from "@chakra-ui/icons"
import { getWishlistService } from "../services/wishlist"
import WishlistAction from "./WishlistAdd"

interface BookResultParams {
  result: PossibleBook,
  currentSearch: string,
}
function BookResult( { result, currentSearch } : BookResultParams) {
  const [link, setLink] = useState<string | null>(null)
  const [image, setImage] = useState<string >("")

  useEffect(() => {
    async function generateLink() {
      const linkService = getLinkGenerationService()
      try {
        const linkInfo = await linkService.generateLink(result.title, result.author)
        setImage(linkInfo.image ? linkInfo.image : "")
        setLink(linkInfo.link)
      }
      catch(err) {
        setImage("")
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
        <VStack align="left">
          <Heading size={{base:"lg", sm:"lg", lg:"lg"}}>{result.title}</Heading>
          <Heading fontWeight="normal" size={{base:"md", sm:"sm", lg:"md"}}>{`${result.author}`}</Heading>
        </VStack>
        
      </CardHeader>
      <CardBody>
        <Flex direction={{base: "column", md: "row"}} gap={{base:4, md:8}}>
          <Skeleton isLoaded={link !== null}>
            <Image alt="book cover" 
              maxHeight="300px" 
              height="100%" 
              src={image}
              fallbackSrc={placeholderImage} 
              objectFit="contain" 
              objectPosition="center top"/>
          </Skeleton>
          <Flex direction="column" flex="1">
            <BookReason book={result} currentSearch={currentSearch}/>
            <Spacer/>
            <Flex>
              <WishlistAction book={result}/>
            </Flex>
          </Flex>
        </Flex>
      </CardBody>
      
      <CardFooter>
        <HStack>
          <Text size="md" as="b">View on:</Text>
          {
            link ? <Button as="a" href={link} target="_blank" rel="sponsored nofollow noopener" bgColor="midnightblue" color="white" borderRadius="full">Amazon</Button> :
            <Spinner/>
          }
        </HStack>    
      </CardFooter>
    </Card>
  )
}

export default BookResult
