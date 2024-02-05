import { getFallbackReason } from "../services/recommendations"
import placeholderImage from "../images/book-cover-placeholder.png"
import {Button, Card, CardBody, CardFooter, CardHeader, Flex, HStack, Heading, Image, Skeleton, Spacer, Spinner, Text, VStack } from "@chakra-ui/react"
import BookReason from "./BookReason"
import { getFixedLink, getLinkGenerationService } from "../services/linkGenerations"
import { useEffect, useState } from "react"
import WishlistAction from "./WishlistAction"
import { useAuthenticator } from "@aws-amplify/ui-react"
import SignupWishlistAction from "./SignupWishlistAction"
import { useAnalytics } from "../context/AnalyticsContext"
import ShopLocalButton from "./ShopLocalButton"
import { getBookInfoService } from "../services/bookInfo"

interface BookDisplayParams {
    title: string,
    author: string,
    reason: string | null
    itemId?: string
  }

export default function BookDisplay({title, author, reason, itemId} : BookDisplayParams) {
    const [link, setLink] = useState<string | null>(null)
    const [image, setImage] = useState<string | null >(null)
    const [isbn, setIsbn] = useState<string | null>(null)
    const {authStatus } = useAuthenticator( (context) => [context.authStatus])
    const {trackAction} = useAnalytics()

    useEffect(() => {
        async function generateLink() {
          const linkService = getLinkGenerationService()
          try {
            const linkInfo = await linkService.generateLink(title, author)
            setLink(linkInfo.link)
          }
          catch(err) {
            setLink(getFixedLink(title))
          }
        }
        async function getBookInfo() {
          const bookService = getBookInfoService()
          try {
            const bookInfo = await bookService.getInfo(title, author)
            setIsbn(bookInfo.isbn)
            setImage(bookInfo.image ? bookInfo.image : "")
          }
          catch(err) {
            setImage("")
            setIsbn(null)
          }
        }
        generateLink()
        getBookInfo()
      },[title, author])

    const trackClick = () => {
      trackAction("Amazon Click")
    }

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
          <Skeleton isLoaded={image !== null}>
            <Image alt="book cover"
              maxHeight="300px"
              height="100%"
              src={image ? image : ""}
              fallbackSrc={placeholderImage}
              objectFit="contain"
              objectPosition="center top" />
          </Skeleton>
          <Flex direction="column" flex="1">
            <BookReason reason={reason}/>
            <Spacer />
            <Flex>
              {authStatus === 'authenticated' ? <WishlistAction item={{title, author, itemId, reason: reason ? reason : getFallbackReason(title)}}/> : <SignupWishlistAction/> }
            </Flex>
          </Flex>
        </Flex>
      </CardBody>
      <CardFooter>
        <HStack>
          <Text size="md" as="b">{itemId ? "Buy on:" : "View on:"}</Text>
          <ShopLocalButton isbn={isbn}/>
          {link ? <Button as="a" href={link} 
          target="_blank" 
          rel="sponsored nofollow noopener" 
          bgColor="midnightblue" 
          color="white" 
          borderRadius="full"
          onClick={() => trackClick()}
          onContextMenu={() => trackClick()}
          >Amazon</Button> :
            <Spinner />}
        </HStack>
      </CardFooter>
    </Card>
    )
  }
  