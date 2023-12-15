import { Card, chakra, Container, Flex } from '@chakra-ui/react';
import { TypeAnimation } from 'react-type-animation';
 
export default function SearchDemo() {
    const ChakraTypeAnimation = chakra(TypeAnimation, {cursor:true})
    return (
        <Flex direction="column" align="center">
            <Container>
            <Card          
                minHeight="100px"
                padding={{base: 2, sm: 4}}
                margin={{base:4, md:8}}
                variant="filled"
                >
                <ChakraTypeAnimation
                    sequence={[
                        'I am looking for great books on cooking',
                        2000, //waits 2 seconds
                        'I am looking for a gripping mystery novel with a strong female detective',
                        2000, 
                        'I am looking for a motivational book that blends self-help with practical career advice', 
                        2000,
                        () => {},
                    ]}
                    wrapper="span"
                    repeat={Infinity}
                    deletionSpeed={70}
                    fontSize={{base:"md", sm:"lg", lg:"xl"}}
                    color="grey"
                />
            </Card>

            </Container>
        </Flex>
    );
};