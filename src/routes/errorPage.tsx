import { Button, Container, Flex, Heading, Text } from "@chakra-ui/react";
import { useNavigate, useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error : any = useRouteError();
  const navigate = useNavigate()

  return (
    <Flex direction="column" align="center" height="100vh" justify="center" gap={4} bgColor="primary">
      <Heading color="white">Oops!</Heading>
      <Text fontSize="xl" color="white">Sorry, an unexpected error has occurred.</Text>
      <Text fontStyle="italic" color="white">
        {error ? error.statusText || error.message : ""}
      </Text>
      <Button onClick={()=>navigate("/")}>Back to Home</Button>
      <Text color="white" fontSize="sm">If this persists please contact support or try again later</Text>
    </Flex>
  );
}