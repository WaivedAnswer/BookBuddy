import {HStack, Text } from '@chakra-ui/react';
import {
    EmailShareButton,
    FacebookShareButton,
    LinkedinShareButton,
    RedditShareButton,
    TwitterShareButton,
    EmailIcon,
    FacebookIcon,
    LinkedinIcon,
    RedditIcon,
    XIcon,
  } from "react-share";

function SocialShareBar( ) {
    return ( 
    <HStack gap={{base: 1, md: 2}}>
        <Text size="lg" color="white">Share</Text>
        <EmailShareButton url="findmyread.com" 
        subject="Book Recommendations" 
        body="If you're looking for really good book recommendations check out"
        openShareDialogOnClick={true}
        onClick={()=>{}}>
            <EmailIcon size={32} round/>
            </EmailShareButton>
        <FacebookShareButton url="findmyread.com"><FacebookIcon size={32} round/></FacebookShareButton>
        <LinkedinShareButton url="findmyread.com" >
            <LinkedinIcon size={32} round/>
            </LinkedinShareButton>
        <TwitterShareButton title="Looking for really good book recommendations? Try out" url="findmyread.com" hashtags={["findmyread", "mybooks"]}>
            <XIcon size={32} round/>
            </TwitterShareButton>
        <RedditShareButton url="findmyread.com" title="Did you know you can get really good book recommendations on FindMyRead?">
            <RedditIcon size={32} round/>
            </RedditShareButton>
    </HStack>
    )
}

export default SocialShareBar