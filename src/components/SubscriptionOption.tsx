
import { Heading, Button, Card, HStack, Text, CardHeader, CardBody, CardFooter, Container, useToast } from '@chakra-ui/react';
import { getStripeService } from '../services/stripe';


interface SubscriptionOptionParams {
    pricingKey: string;
    title: string;
    price: string;
    details: string;
}

export default function SubscriptionOption({pricingKey, title, price, details} : SubscriptionOptionParams) {
    const errorToast = useToast()
    
    const checkout = async () => {
        try {
            await getStripeService().checkout(pricingKey)
        } catch (e) {
            console.error(e)
            errorToast({
                title: "Subscription Unavailable",
                description: "We've encountered an error. Try again later",
                status: "error",
                duration: 9000,
                isClosable: true,
            })
        }
    }


    return <Card background="gray.300" variant="elevated" align="center">
        <CardHeader>
            <Heading fontSize="2xl">{title}</Heading>
        </CardHeader>
        <CardBody>
            <HStack>
            <Text fontWeight="bold" fontSize="3xl">{price}</Text>
            <Container>
                <Text color="gray.500" fontSize="sm">{details}</Text>
            </Container>
            </HStack>
            

        </CardBody>
        <CardFooter justify="center">
                <Button id="checkout-and-portal-button" 
                colorScheme="blue"
                onClick={checkout}>
                    Try Free
                </Button>
        </CardFooter>
    </Card>;
}