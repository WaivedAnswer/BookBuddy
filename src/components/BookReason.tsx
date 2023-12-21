import {Flex, SkeletonText, Text } from "@chakra-ui/react"
import { useEffect } from "react"
import { PossibleBook, getFallbackReason, getRecommendationService } from "../services/recommendations"

interface BookReasonParams {
    reason: string | null,
}

function BookReason( {reason } : BookReasonParams) {
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