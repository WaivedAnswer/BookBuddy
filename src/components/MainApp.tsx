import {
    Text,
    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel} from '@chakra-ui/react';
  import SearchTab from '../components/SearchTab';
  import WishList from '../components/WishList';
  import { WishlistProvider } from '../context/WishlistContext';
  import WishlistTabTitle from '../components/WishlistTabTitle';
import { useSubscription } from '../context/SubscriptionContext';
import { Navigate } from 'react-router-dom';
  
  interface MainAppParams {
    headerOffset : number
  }
  function MainApp({headerOffset} : MainAppParams) {
    const {isActive} = useSubscription()

    if(!isActive()) {
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
  