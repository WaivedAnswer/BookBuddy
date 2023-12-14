import { Flex, Heading, Text } from "@chakra-ui/react";
import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error : any = useRouteError();
  console.error(error);

  return (
    <Flex direction="column" align="center" height="100vh" justify="center" gap={4} bgColor="primary">
      <Heading color="white">Oops!</Heading>
      <Text fontSize="xl" color="white">Sorry, an unexpected error has occurred.</Text>
      <Text fontStyle="italic" color="white">
        {error.statusText || error.message}
      </Text>
    </Flex>
  );
}