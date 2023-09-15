import { Flex, Heading, Text, Stack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { ClearCart } from "./clear";

export const CartHeader = ({ total }) => {
    const navigate = useNavigate();

    return (
        <Stack gap={6}>
            <Flex borderBottom={total ? null: '2px solid gray'} pb={total ? 0 : 7} alignItems={'center'} justifyContent={{ base: 'space-between', md: 'start' }}>
                <Heading fontWeight={'semibold'}>
                    My Cart
                </Heading>
                {total ? (
                <Text display={{ base: 'block', md: 'none' }} fontSize={'20px'} fontWeight={'medium'}>
                    {total} Items
                </Text>
                ) : null}
            </Flex>
            {total ? (
            <Flex 
            fontSize={'17px'} 
            fontWeight={'light'}
            w='100%' 
            justifyContent={'space-between'} 
            alignItems={'center'}
            borderBottom={'2px solid gray'}>
                <Text cursor={'pointer'} onClick={() => navigate('/search')} color={'gray.500'} _hover={{ color: 'black' }}>
                    Continue Shopping
                </Text>
                <Text display={{ base: 'none', md: 'block' }} fontWeight={'medium'}>
                    {total} Items
                </Text>
                <ClearCart isEmpty={total ? false : true} />
            </Flex>
            ) : null}
        </Stack>
    )
}