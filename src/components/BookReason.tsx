import {Flex, SkeletonText, Text } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { PossibleBook, getFallbackReason, getRecommendationService } from "../services/recommendations"

interface BookReasonParams {
    book: PossibleBook,
    currentSearch: string,
}

function BookReason( {book, currentSearch } : BookReasonParams) {
  const [reason, setReason] = useState<string | null>(null)
  useEffect(() => {
    async function loadReason() {
      try {
        const result = await getRecommendationService().getReason(book, currentSearch)
        setReason(previousReason => previousReason ? previousReason : result)
      } catch (error) {
        setReason(getFallbackReason(book.title))
      }
    }
    loadReason()
  }, [book, currentSearch])
  return ( 

      <Flex direction="column" justify="center">
        {reason ? 
        <Text fontSize={{base:"lg", lg:"xl", xl:"2xl"}}>
            <Text as="span" fontWeight="bold">Why You'll Love This: </Text>{reason}
        </Text> : 
        <SkeletonText noOfLines={{base: 5, sm: 3}} mt='4' spacing='4' skeletonHeight='2' isLoaded={reason != null}/>}
      </Flex>
  )
}

export default BookReason