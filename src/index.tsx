import ReactDOM from 'react-dom/client';

import './index.css';
import '@aws-amplify/ui-react/styles.css';

import App from './App';
import reportWebVitals from './reportWebVitals';

import theme from './themes/theme'

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import { ChakraProvider } from '@chakra-ui/react';

import ErrorPage from './routes/errorPage';
import LoginPage from './routes/loginPage';

import { LoginFlow } from './models/loginFlow';
import { RecommendationProvider } from './context/RecommendationContext';
import { AnalyticsProvider } from './context/AnalyticsContext';


// Configure Amplify in index file or root file
Amplify.configure({
  Auth: {
    Cognito: {
      //  Amazon Cognito User Pool ID
      userPoolId: process.env.REACT_APP_COGNITO_POOL_ID ?? "",
      // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
      userPoolClientId: process.env.REACT_APP_POOL_CLIENT_ID ?? "",
      // // REQUIRED only for Federated Authentication - Amazon Cognito Identity Pool ID
      // identityPoolId: 'XX-XXXX-X:XXXXXXXX-XXXX-1234-abcd-1234567890ab',
      // OPTIONAL - This is used when autoSignIn is enabled for Auth.signUp
      // 'code' is used for Auth.confirmSignUp, 'link' is used for email link verification
      signUpVerificationMethod: 'code', // 'code' | 'link'
    }
  }
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/login",
    element: <LoginPage initialState={LoginFlow.SIGN_IN}/>,
    errorElement: <ErrorPage />
  },
  {
    path: "/signup",
    element: <LoginPage initialState={LoginFlow.SIGN_UP}/>,
    errorElement: <ErrorPage />
  }
]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <Authenticator.Provider>
    <AnalyticsProvider>
      <RecommendationProvider>
        <ChakraProvider theme={theme}>
            <RouterProvider router={router} />
        </ChakraProvider>
      </RecommendationProvider>
    </AnalyticsProvider>
  </Authenticator.Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
