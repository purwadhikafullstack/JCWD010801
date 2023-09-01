import { Flex, Stack, Text, Image, Divider } from "@chakra-ui/react";
import logo from '../assets/public/AM_logo_trans.png'

export const Footer = ({isNotDisabled = true}) => {
    return (
        <>
        {isNotDisabled && (
            <Stack w='100%' bgColor='gray.100' gap={4} p={'2rem 5rem'} alignItems={'center'}>
                <Flex w='100%' h='100%' justifyContent={'space-between'} >
                    <Stack>
                        <Image src={logo} w={'200px'} />
                    </Stack>
                    <Flex w='40%' gap={'3rem'} justifyContent={'space-between'} >
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
                        <Stack gap={3} p={2}>
                            <Text fontWeight={'bold'}>
                                SOCIALS
                            </Text>
                            <Text cursor={'pointer'} _hover={{fontWeight: 'medium'}} color={'gray'} >
                                Instagram
                            </Text>
                            <Text cursor={'pointer'} _hover={{fontWeight: 'medium'}} color={'gray'} >
                                Twitter
                            </Text>
                            <Text cursor={'pointer'} _hover={{fontWeight: 'medium'}} color={'gray'} >
                                Whatsapp
                            </Text>
                        </Stack>
                    </Flex>
                </Flex>
                <Divider colorScheme="blackAlpha" />
                <Text>
                    Copyright © 2023 Alphamart. All rights reserved.
                </Text>
            </Stack>
        )}
        </>
    )
}