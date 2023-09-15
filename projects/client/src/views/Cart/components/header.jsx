import { Flex, Heading, Text, Stack } from "@chakra-ui/react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ClearCart } from "./clear";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

export const CartHeader = () => {

    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const [ total, setTotal ] = useState(0);
    const { refresh } = useSelector((state) => state.cart.value);

    const fetchData = async() => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/cart`, {
                headers: {
                    authorization: `Bearer ${token}`
                }
            });
            setTotal(data.total);
        } catch (err) {
            if ( err.response.data.message !== "Cart not found" ) {
                toast.error("Failed to fetch your cart data, please try again later.", {
                    position: "top-center",
                    autoClose: 2500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
            };
        }
    }

    useEffect(() => {
        fetchData();
    }, [ refresh ]);

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
            // pb={2} 
            borderBottom={'2px solid gray'}>
                <Text cursor={'pointer'} onClick={() => navigate('/search')} color={'gray.500'} _hover={{ color: 'black' }}>
                    Continue Shopping
                </Text>
                <Text display={{ base: 'none', md: 'block' }} fontWeight={'medium'}>
                    {total} Items
                </Text>
                <ClearCart />
            </Flex>
            ) : null}
        </Stack>
    )
}