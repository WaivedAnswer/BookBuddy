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
  
  interface MainAppParams {
    headerOffset : number
  }
  function MainApp({headerOffset} : MainAppParams) {
    return (
      <WishlistProvider>
          <Tabs flex="1" variant="enclosed-colored" align="start" size="md">
            <TabList position="sticky" top={headerOffset} zIndex={1} bgColor="gray.200">
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
  