
import { Heading, Button, Card, HStack, Text, CardHeader, CardBody, CardFooter, Container } from '@chakra-ui/react';
import { getStripeService } from '../services/stripe';


interface SubscriptionOptionParams {
    pricingKey: string;
    title: string;
    price: string;
    details: string;
}

export default function SubscriptionOption({pricingKey, title, price, details} : SubscriptionOptionParams) {
    const checkout = () => {
        getStripeService().checkout(pricingKey)
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