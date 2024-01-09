  import { Heading, Text, Container, HStack, Button, Flex, Divider } from '@chakra-ui/react';
import SearchTab from '../components/SearchTab';
import { useNavigate } from 'react-router-dom';
import { useAnalytics } from '../context/AnalyticsContext';
  
  function LandingPage() {
    const { trackAction } = useAnalytics()
    const navigate = useNavigate()
    const onSignup = () => {
      trackAction("Landing Signup")
      navigate("/signup")
    }

    return (
    <Flex flex="1" direction="column">
            <SearchTab/>
            <Container mt={{base: 6, md: 24}} mb={{base: 6, md: 16}}>
              <Divider width={{base:"0%", md:"100%"}}/>
            </Container>

            <HStack align="center" justify="center" mb={{base:6, md:16}}>
              <Container margin={0} maxW="md">
                <Heading size={{base:"md", md:"lg"}}>Saving For Later?</Heading>
                <Text fontSize={{base:"md", md:"lg"}}>Sign up to save books to your wishlist</Text>
              </Container>
              <Button onClick={onSignup} margin={0} size={{base:"md", md:"lg"}} mr={4}>Sign up</Button>
            </HStack>
            
    </Flex>
    )
  }
  
  export default LandingPage;
  