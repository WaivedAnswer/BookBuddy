import { Heading, Flex, Card, HStack, Text, VStack, Container, Spacer, Link, Center } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useSubscription } from '../context/SubscriptionContext';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { useNavigate } from 'react-router-dom';
import SubscriptionOption from './SubscriptionOption';

const ProductDisplay = ({ message } : {message: string}) => {
    const {signOut} = useAuthenticator((context) => [context.user])
    const {clearContext} = useSubscription()

    const navigate = useNavigate()

    const onLogout = async (e : any) => {
        e.preventDefault()
        await signOut()
        await clearContext()
        navigate("/")
      }

    return (
  <Flex flex="1" width="100%" height="100%" align="center" justify="center" flexDirection="column">
    <Card boxSize="lg">
        <VStack margin={4} justify="space-between" height="100%">
            <VStack>
            <HStack spacing={8}>
                <SubscriptionOption title="Monthly" price="$4.99" details="billed monthly" pricingKey="FMR-Monthly"/>
                <SubscriptionOption title="Annual" price="$49.99" details="billed yearly" pricingKey="FMR-Yearly"/>
            </HStack>
            <Text color="gray.500" fontSize="xs">*Free trial lasts 30 days</Text>
            </VStack>
            
            <Link onClick={onLogout}>I changed my mind</Link>
            {
                message ? <>
                    <Spacer/>
                    <Message message={message}/>
                </> : ""
            }
            
        </VStack>
    </Card>

  </Flex>
);}


const SuccessDisplay = () => {
  return (
    <Flex flex="1" width="100%" height="100%" align="center" justify="center" flexDirection="column">
        <Card boxSize="lg">
          <VStack height="100%" margin={4} gap={4}>
            <Heading>Subscription Successful</Heading>
            <Text>Congratulations! You're one step closer to your next level</Text>
          </VStack>
        </Card>
    </Flex>
  );
};

const Message = ({ message } : {message: string}) => (
  <Container>
    <Text textAlign="center">{message}</Text>
  </Container>
);



function SubscriptionPage() {
  let [message, setMessage] = useState('');
  let [success, setSuccess] = useState(true);
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
        "Order canceled, check out when you're ready."
      );
    }
  }, []);

  useEffect(() => {
    if(success) {
        updateSubscriptionStatus()
    }
  }, [success, updateSubscriptionStatus])

  if (!success) {
    return <ProductDisplay message={message}/>;
  } else {
    return <SuccessDisplay />;
  }
  }
  
  export default SubscriptionPage;
  