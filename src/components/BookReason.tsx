import {Flex, SkeletonText, Text } from "@chakra-ui/react"

interface BookReasonParams {
    reason: string | null,
}

function BookReason( {reason } : BookReasonParams) {
  return ( 
      <Flex direction="column" justify="center" mb={2}>
      <SkeletonText noOfLines={{base: 5, sm: 3}} skeletonHeight = {{base:"3", md:"4"}} spacing="3" isLoaded={reason !== null}>
        <Text fontSize={{base:"lg", lg:"xl", xl:"2xl"}}>
            <Text as="span" fontWeight="bold">Why You'll Love This: </Text>{reason}
        </Text>
        </SkeletonText>
      </Flex>
  )
}

export default BookReason