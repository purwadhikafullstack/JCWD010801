import { Flex, Stack, Text, Image, Divider } from "@chakra-ui/react";
import logo from '../assets/public/AM_logo_trans.png'

export const Footer = ({isNotDisabled = true}) => {
    return (
        <>
        {isNotDisabled && (
            <Stack overflow={'hidden'} w='100vw' bgColor='gray.200' gap={4} p={'1rem 2rem'} alignItems={'center'}>
                <Flex  >
                    <Image src={logo} w={'150px'} />
                    <Flex justifyContent={'space-between'} >
                        <Stack gap={3} p={2}>
                            <Text fontWeight={'bold'}>
                                LOCATION
                            </Text>
                            <Text cursor={'pointer'} _hover={{fontWeight: 'medium'}} color={'gray'} >
                                Bandung
                            </Text>
                            <Text cursor={'pointer'} _hover={{fontWeight: 'medium'}} color={'gray'} >
                                Jakarta
                            </Text>
                            <Text cursor={'pointer'} _hover={{fontWeight: 'medium'}} color={'gray'} >
                                Surabaya
                            </Text>
                            <Text cursor={'pointer'} _hover={{fontWeight: 'medium'}} color={'gray'} >
                                Yogyakarta
                            </Text>
                        </Stack>
                        <Stack gap={3} p={2}>
                            <Text fontWeight={'bold'}>
                                CONTACT
                            </Text>
                            <Text cursor={'pointer'} _hover={{fontWeight: 'medium'}} color={'gray'} >
                                Bandung
                            </Text>
                            <Text cursor={'pointer'} _hover={{fontWeight: 'medium'}} color={'gray'} >
                                Jakarta
                            </Text>
                            <Text cursor={'pointer'} _hover={{fontWeight: 'medium'}} color={'gray'} >
                                Surabaya
                            </Text>
                            <Text cursor={'pointer'} _hover={{fontWeight: 'medium'}} color={'gray'} >
                                Yogyakarta
                            </Text>
                        </Stack>
                    </Flex>
                </Flex>
                <Divider colorScheme="gray" />
                <Text>
                    Copyright © 2023 Alphamart. All rights reserved.
                </Text>
            </Stack>
        )}
        </>
    )
}