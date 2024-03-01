import { Button, Flex, useToast } from "@chakra-ui/react";
import { getStripeService } from "../services/stripe";

export default function SettingsPage() {
    const onManage = async () => {
      try {
        await getStripeService().manageCustomer()
      } catch (e) {
        console.error(e)
        errorToast({
            title: "Subscription Unavailable",
            description: "We've encountered an error. Please contact support for assistance",
            status: "error",
            duration: 9000,
            isClosable: true,
        })
      }
    }

    const errorToast = useToast()
    
  return (
    <Flex direction="column" align="center" height="100vh" justify="center" bgColor="primary">
        <Button onClick={onManage}>Manage Subscription</Button>
    </Flex>
  );
}