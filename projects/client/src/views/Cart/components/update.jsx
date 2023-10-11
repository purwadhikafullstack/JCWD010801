import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { Flex, Icon, Input, Stack, Text } from "@chakra-ui/react";
import { ButtonTemp } from "../../../components/button";
import { HiPlus, HiMinus } from "react-icons/hi";
import { useRef } from "react";
import { useDispatch } from "react-redux";
import { refreshCart } from "../../../redux/cartSlice";

export const UpdateCart = ({ ProductId, qty, stock, isExtra }) => {
    const token = localStorage.getItem('token');
    const BranchId = localStorage.getItem("BranchId");
    const quantityRef = useRef();
    const dispatch = useDispatch();

    const handleUpdate = async() => {
        try {
            let quantity;
            if (quantityRef.current.value === null) quantity = 1
            else quantity = quantityRef.current.value;
            
            await axios.patch(`${process.env.REACT_APP_API_BASE_URL}/cart`, { ProductId, quantity, BranchId }, {
                headers: {
                    authorization: `Bearer ${token}`
                }
            });
            dispatch(refreshCart());
        } catch (err) {
            if ( err.response.data.message === "Promo product out of stock" ) {
                quantityRef.current.value = err.response.data.maxStock;
                handleUpdate();
            } else if ( err.response.data.message === "Product out of stock" ) {
                quantityRef.current.value = +stock;
                handleUpdate();
            } else if ( err.response.data.message === "Minimum item 1" && quantityRef.current.value ) {
                quantityRef.current.value = 1;
                handleUpdate();
            } else if ( quantityRef.current.value ) {
                toast.error("Failed to update cart, please try again later.", {
                    position: "top-center",
                    autoClose: 2500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
            }
        }
    };

    const increaseQuantity = () => {
        quantityRef.current.value = +quantityRef.current.value + 1
        handleUpdate();
    };
    
    const decreaseQuantity = () => {
        quantityRef.current.value = quantityRef.current.value - 1
        handleUpdate();
    };

    return (
        <Stack justifyContent={'center'} alignItems={'center'}>
            <Flex gap={1} justifyContent={'center'} alignItems={'center'}>
                <ButtonTemp  
                p={0}
                isDisabled={qty <= 1 ? true : false}
                onClick={() => decreaseQuantity()}
                borderRadius={0}
                content={(<Icon as={HiMinus} w='5' h='5'/>)} />
                <Input 
                defaultValue={qty} 
                borderRadius={0}
                ref={quantityRef}
                onChange={(e) => {
                    e.preventDefault();
                    handleUpdate();
                }}
                w={{ base: '50px', md: '60px' }} 
                mx='2px' 
                textAlign={'center'}
                type="number" 
                fontSize={{ base: 'sm', md: 'md' }}
                borderColor={"blackAlpha.300"}
                focusBorderColor="blackAlpha.400"
                />
                <ButtonTemp 
                p={0}
                borderRadius={0}
                isDisabled={qty === +stock  ? true : false}
                onClick={() => increaseQuantity()}
                content={(<Icon as={HiPlus} w='5' h='5'/>)} />
            </Flex>
            {isExtra && (
            <Text fontSize={"sm"} fontWeight={"light"} color={"red"}>
                + {qty * 2 > stock ? qty - 1 : qty} FREE
            </Text>
            )}
        </Stack>
    )
}