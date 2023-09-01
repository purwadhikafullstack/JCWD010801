import { Flex, Stack, Text, Heading } from "@chakra-ui/react";
import { FeatureCard } from "./card";
import { BsTruck } from "react-icons/bs";
import { FaHandHoldingHeart } from "react-icons/fa";
import { GiFruitBowl } from "react-icons/gi";

export const Features = () => {
    return (
        <Stack w='100%' gap='3'>
            <Flex h='4rem' justifyContent={'space-between'}>
                <Heading fontWeight={'semibold'} >
                    Why Alphamart?
                </Heading>
                <Flex alignItems={'center'} borderLeft={'3px solid black'} >
                    <Text ml={10} color={'gray.500'} fontSize={'lg'}>
                        We ensure our customer have the best shopping experience
                    </Text>
                </Flex >
            </Flex>
            <Flex mt={'1rem'} justifyContent={'space-between'}>
                <FeatureCard icon={GiFruitBowl} title={'Freshness Guaranteed'} description={'We pick only the freshest groceries.'} />
                <FeatureCard icon={BsTruck} title={'Quick Shipping'} description={'We offer fast and free shipping for our loyal customers.'} />
                <FeatureCard icon={FaHandHoldingHeart} title={'Handled with Care'} description={'Great and quality products picked and handled with care.'} />
            </Flex>
        </Stack>
    )
}