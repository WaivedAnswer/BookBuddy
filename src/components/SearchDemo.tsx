import { Card, chakra, Container, Flex } from '@chakra-ui/react';
import { TypeAnimation } from 'react-type-animation';
 
export default function SearchDemo() {
    const demoPhrases = [
        'I am looking for the best books on leadership',
        'I am looking for a cozy romantic winter read',
        'I am looking for a gripping mystery novel with a strong female detective',
        'I am looking for the best classic fiction books to read on my holiday',
        'I am looking for books to help me get started in gardening',
        'I am looking for books to become a better programmer',
    ]

    const getSequence = () => {
        const PAUSE_INTERVAL = 3000
        const sequence = [];
        const completionFunction = () => {}
        for(const demoPhrase of demoPhrases) {
            sequence.push(demoPhrase)
            sequence.push(PAUSE_INTERVAL)
        }
        sequence.push(completionFunction)
        return sequence
    }

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
                    sequence={getSequence()}
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