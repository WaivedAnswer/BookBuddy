import { Heading, Button, Flex, Card } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { getStripeService } from '../services/stripe';
import { useSubscription } from '../context/SubscriptionContext';

const ProductDisplay = () => {

    const checkout = () => {
        getStripeService().checkout("FMR-Monthly")
    }

    return (
  <Flex flex="1" width="100%" height="100%" align="center" justify="center" flexDirection="column">
    <Card boxSize="lg">
        <Heading fontSize="4xl">Starter plan</Heading>
        <Heading fontSize="lg">$4.99 / month</Heading>
      <Button id="checkout-and-portal-button" onClick={checkout}>
        Checkout
      </Button>
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
        console.log("Updating subscription status")
        updateSubscriptionStatus()
    }
  }, [success, updateSubscriptionStatus])

  if (!success && message === '') {
    return <ProductDisplay />;
  } else if (success) {
    return <ProductDisplay />;
  } else {
    return <Message message={message} />;
  }
  }
  
  export default SubscriptionPage;
  