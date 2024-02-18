import { Button, Flex } from "@chakra-ui/react";
import { getStripeService } from "../services/stripe";

export default function SettingsPage() {
    const onManage = () => {
        getStripeService().manageCustomer()
    }
  return (
    <Flex direction="column" align="center" height="100vh" justify="center" bgColor="primary">
        <Button onClick={onManage}>Manage Subscription</Button>
    </Flex>
  );
}