# Generative AI Book Recommendation Front-End

This project is the front-end for a Generative AI book recommendation platform where users can search for books related to their learning interests.

## Getting Started

1. **Create a `.env` file** including the following environment variables:

    ```env
    # Whether to mock out the service backends with local classes  
    REACT_APP_REC_SERVICE=("true"/"false")  
    REACT_APP_BOOK_SERVICE=("true"/"false")  
    REACT_APP_SHOP_LOCAL_SERVICE=("true"/"false")  

    # Overrides above flags and runs with all services active  
    REACT_APP_ALL_SERVICES=("true"/"false")

    # Contact email  
    REACT_APP_FEEDBACK_EMAIL=""  

    # Cognito configuration for auth  
    # https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-scenarios.html  
    REACT_APP_COGNITO_POOL_ID=""  
    REACT_APP_POOL_CLIENT_ID=""

    # Backend root URL  
    REACT_APP_API_URL=""
    ```

2. **Run the app**:

    ```bash
    npm start
    ```

## Basic Project Structure

- `src/services`: Outbound requests to Lambda backends or Local Mocked Services. You can modify mocked services to return anything, as long as they match the interface.
- `src/components`: React components.
- `src/context`: React Context Providers.
