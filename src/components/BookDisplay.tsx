import { getFallbackReason } from "../services/recommendations"
import placeholderImage from "../images/book-cover-placeholder.png"
import {Button, Card, CardBody, CardFooter, CardHeader, Flex, HStack, Heading, Image, Skeleton, Spacer, Spinner, Text, VStack } from "@chakra-ui/react"
import BookReason from "./BookReason"
import { getFixedLink, getLinkGenerationService } from "../services/linkGenerations"
import { useEffect, useState } from "react"
import WishlistAction from "./WishlistAction"

interface BookDisplayParams {
    title: string,
    author: string,
    reason: string | null
  }

export default function BookDisplay({title, author, reason} : BookDisplayParams) {
    const [link, setLink] = useState<string | null>(null)
    const [image, setImage] = useState<string >("")

    useEffect(() => {
        async function generateLink() {
          const linkService = getLinkGenerationService()
          try {
            const linkInfo = await linkService.generateLink(title, author)
            setImage(linkInfo.image ? linkInfo.image : "")
            setLink(linkInfo.link)
          }
          catch(err) {
            setImage("")
            setLink(getFixedLink(title))
          }
        }
        generateLink()
      },[title, author])

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
          <Heading size={{ base: "lg", sm: "lg", lg: "lg" }}>{title}</Heading>
          <Heading fontWeight="normal" size={{ base: "md", sm: "sm", lg: "md" }}>{`${author}`}</Heading>
        </VStack>
  
      </CardHeader>
      <CardBody>
        <Flex direction={{ base: "column", md: "row" }} gap={{ base: 4, md: 8 }}>
          <Skeleton isLoaded={link !== null}>
            <Image alt="book cover"
              maxHeight="300px"
              height="100%"
              src={image}
              fallbackSrc={placeholderImage}
              objectFit="contain"
              objectPosition="center top" />
          </Skeleton>
          <Flex direction="column" flex="1">
            <BookReason reason={reason}/>
            <Spacer />
            <Flex>
              <WishlistAction item={{title, author, reason: reason ? reason : getFallbackReason(title)}}/>
            </Flex>
          </Flex>
        </Flex>
      </CardBody>
      <CardFooter>
        <HStack>
          <Text size="md" as="b">Buy on:</Text>
          {link ? <Button as="a" href={link} target="_blank" rel="sponsored nofollow noopener" bgColor="midnightblue" color="white" borderRadius="full">Amazon</Button> :
            <Spinner />}
        </HStack>
      </CardFooter>
    </Card>
    )
  }
  