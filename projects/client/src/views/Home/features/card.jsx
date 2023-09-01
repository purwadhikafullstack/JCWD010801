import { Stack, Text, Icon, Flex } from "@chakra-ui/react";

export const FeatureCard = ({ icon, title, description }) => {
    return (
        <Stack w='200px'>
            <Flex w='12' h='12' justifyContent={'center'} alignItems={'center'} borderRadius={'3'} bgColor={'gray.100'} >
                <Icon as={icon} color='black' w='8' h='8' />
            </Flex>
            <Text fontWeight={'medium'} >{title}</Text>
            <Text fontSize={'sm'} fontWeight={'normal'} color={'gray.500'}>{description}</Text>
        </Stack>
    )
}