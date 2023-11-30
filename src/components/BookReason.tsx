import {Box, SkeletonText, Text } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { PossibleBook, getRecommendationService } from "../services/recommendations"

interface BookReasonParams {
    book: PossibleBook
}

function BookReason( {book } : BookReasonParams) {
  const [reason, setReason] = useState<string | null>(null)
  useEffect(() => {
    async function loadReason() {
        const result = await getRecommendationService().getReason(book, "I am looking for good books")
        setReason(result)
    }
    loadReason()
  }, [book])
  return ( 

      <Box>
        <SkeletonText noOfLines={2} mt='4' spacing='4' skeletonHeight='2' isLoaded={reason != null}>
        </SkeletonText>
        <Text fontSize="lg">{reason}</Text>
        
      </Box>
  )
}

export default BookReason