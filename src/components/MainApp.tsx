import {
    Text,
    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
    Center} from '@chakra-ui/react';
  import SearchTab from '../components/SearchTab';
  import WishList from '../components/WishList';
  import { WishlistProvider } from '../context/WishlistContext';
  import WishlistTabTitle from '../components/WishlistTabTitle';
import { useSubscription } from '../context/SubscriptionContext';
import { Navigate } from 'react-router-dom';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { SubscriptionType } from '../services/subscriptionStatus';
import LoadingIcon from './LoadingIcon';
  
  interface MainAppParams {
    headerOffset : number
  }
  function MainApp({headerOffset} : MainAppParams) {
    const {subscriptionStatus} = useSubscription()
    const {user} = useAuthenticator((context) => [context.user])

    if(user && subscriptionStatus === SubscriptionType.UNKNOWN) {
      return (
        <Center flex="1">
          <Text>Loading...</Text>
          <LoadingIcon/>
        </Center>)
    }
    else if(user && subscriptionStatus !== SubscriptionType.ACTIVE) {
      return (<Navigate to="/signup"/> )
    }
    return (
      <WishlistProvider>
          <Tabs flex="1" variant="enclosed-colored" align="start" size="md">
            <TabList position="sticky" top={headerOffset} zIndex={10} bgColor="gray.200">
                <Tab><Text size="md">Search</Text></Tab>
                <Tab><WishlistTabTitle/></Tab>
              </TabList>
            <TabPanels>
              <TabPanel><SearchTab/></TabPanel>
              <TabPanel><WishList/></TabPanel>
            </TabPanels>
          </Tabs>
      </WishlistProvider>
    );
  }
  
  export default MainApp;
  