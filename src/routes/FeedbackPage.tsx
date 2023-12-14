import { Flex, Heading, Text } from "@chakra-ui/react";

export default function FeedbackPage() {
  return (
    <Flex direction="column" align="center" height="100vh" justify="center" gap={4} bgColor="primary">
      <Heading color="white">Feedback</Heading>
      <Text fontSize="xl" color="white">Feedback Welcome!</Text>
      <Text fontStyle="italic" color="white">
      </Text>
    </Flex>
  );
}