import { Button, Card, CardBody, CardFooter, CardHeader, HStack, Heading, Link, Spacer, Text, VStack } from "@chakra-ui/react";
import { useAnalytics } from "../context/AnalyticsContext";

export interface ShopResultParams {
    address : string,
    city : string,
    distance_km : number,
    //distance_mi : 34,
    // is_preorder: false
    // latitude : "49.8859"
    // longitude : "-119.4948"
    name : string
    onhand : true
    onorder : false
    phone : string
    // postal : "V1Y 6N8"
    // province : "BC"
    san : string
    url : string
}

interface ShopParams {
    result: ShopResultParams
}
export default function ShopLocalButton({result} : ShopParams) {
    const {trackAction} = useAnalytics()
    return (
        <Card
        variant="outline"
        >
            <CardHeader>
                <HStack justify="space-between">
                    <Heading size="md">{result.name}</Heading>
                    <Text whiteSpace="nowrap">{`${result.distance_km} km`}</Text>
                </HStack>
            </CardHeader>
            <CardBody>
                <Text>{result.address}</Text>
                <Text>{result.city}</Text>
                <Text>{result.phone}</Text>
            </CardBody>
            <CardFooter>
                <HStack width="100%" justify="space-between">
                <HStack>
                    {result.onhand ? <Text textColor="green">In Stock</Text> : ""}
                    {result.onorder ? <Text textColor="orange">On Order</Text> : ""}
                </HStack>
                <Button as="a" 
                href={result.url} 
                onClick={() => trackAction("Shop Local Visit")}
                onContextMenu={() => trackAction("Shop Local Visit")}
                target="_blank" 
                rel="sponsored nofollow noopener" 
                colorScheme="blue">Visit</Button>
                </HStack>
            </CardFooter>
            
        </Card>
    );
};