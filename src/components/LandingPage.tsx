import {
    Box, 
    Divider, 
    Flex, 
    Heading, 
    Text,
    Center,
    Button,
    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel} from '@chakra-ui/react';
  import SocialShareBar from '../components/SocialShareBar';
  import SearchTab from '../components/SearchTab';
  import { useEffect, useRef, useState } from 'react';
  import WishList from '../components/WishList';
  import { WishlistProvider } from '../context/WishlistContext';
  import WishlistTabTitle from '../components/WishlistTabTitle';
  import { useAuthenticator } from '@aws-amplify/ui-react';
  import { useNavigate } from 'react-router-dom';
  
  function LandingPage() {
    return (
    <SearchTab/>
    )
  }
  
  export default LandingPage;
  