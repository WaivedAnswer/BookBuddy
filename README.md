Detailed README coming soon!

This project is the front-end for a Generative AI book recommendation platform where users can search for books related to their learning interests.

Run with npm start

Requires:
.env file including:

#Whether to mock out the service backends with local classes
REACT_APP_REC_SERVICE=("true"/"false")
REACT_APP_BOOK_SERVICE=("true"/"false")
REACT_APP_SHOP_LOCAL_SERVICE=("true"/"false")

#Overrides above flags and runs with all services active
REACT_APP_ALL_SERVICES=("true"/"false")

#contact email
REACT_APP_FEEDBACK_EMAIL=""

#cognito configuration for auth https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-scenarios.html
REACT_APP_COGNITO_POOL_ID=""
REACT_APP_POOL_CLIENT_ID=""

#backend root url
REACT_APP_API_URL=""

Basic structure:
src/services: Outbound requests to lambda backends or Local Mocked Services. Can modify Mocked services to return anything as long as they match interface

src/components: React Components

src/context: React Context Providers

