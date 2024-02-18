import { Heading, Button, Flex, Card, HStack, VStack, Link } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { getStripeService } from '../services/stripe';
import { useSubscription } from '../context/SubscriptionContext';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { useNavigate } from 'react-router-dom';

const ProductDisplay = () => {
    const {signOut} = useAuthenticator((context) => [context.user])
    const {clearContext} = useSubscription()
    const checkout = () => {
        getStripeService().checkout("FMR-Monthly")
    }
    const navigate = useNavigate()

    const onLogout = async () => {
        await signOut()
        await clearContext()
        navigate("/")
      }

    return (
  <Flex flex="1" width="100%" height="100%" align="center" justify="center" flexDirection="column">
    <Card boxSize="lg">
        <VStack>
            <HStack>
                <Card>
                    <Heading fontSize="4xl">Starter plan</Heading>
                    <Heading fontSize="lg">$4.99 / month</Heading>
                    <Button id="checkout-and-portal-button" onClick={checkout}>
                        Checkout
                    </Button>
                </Card>
            </HStack>
            <Button onClick={onLogout}>I changed my mind</Button>
        </VStack>
    </Card>

  </Flex>
);}

interface SuccessParams {
}

const SuccessDisplay = ({ } : SuccessParams) => {
  return (
    <Flex flex="1" width="100%" height="100%" align="center" justify="center" flexDirection="column">
        <Card boxSize="lg">
        <Heading>Subscription to starter plan successful!</Heading>
        </Card>
    </Flex>
  );
};

const Message = ({ message } : {message: string}) => (
  <section>
    <p>{message}</p>
  </section>
);

function SubscriptionPage() {
  let [message, setMessage] = useState('');
  let [success, setSuccess] = useState(false);
  const {updateSubscriptionStatus} = useSubscription()

  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);

    if (query.get('success')) {
      setSuccess(true);
    }

    if (query.get('canceled')) {
      setSuccess(false);
      setMessage(
        "Order canceled -- continue to shop around and checkout when you're ready."
      );
    }
  }, []);

  useEffect(() => {
    if(success) {
        updateSubscriptionStatus()
    }
  }, [success, updateSubscriptionStatus])

  if (!success && message === '') {
    return <ProductDisplay />;
  } else if (success) {
    return <SuccessDisplay />;
  } else {
    return <Message message={message} />;
  }
  }
  
  export default SubscriptionPage;
  