import { Grid, GridItem, Stack, useDisclosure, Modal, ModalOverlay, ModalContent, ModalCloseButton, ModalBody, Icon, Heading, Text, Flex, Button } from "@chakra-ui/react"
import { CartHeader } from "./components/header"
import axios from "axios"
import { CartList } from "./components/list"
import { Receipt } from "./components/receipt"
import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { ReceiptMobile } from "./components/receiptMobile"
import { EmptyCart } from "./components/empty"
import { ErrorPageLayout } from "../../components/errorLayout"
import { refreshCart } from "../../redux/cartSlice"
import { HiOutlineExclamationCircle } from "react-icons/hi"
import { ButtonTemp } from "../../components/button"
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

export const CartPageView = () => {
    const token = localStorage.getItem("token");
    const BranchId = localStorage.getItem("BranchId")
    const [ subtotal, setSubtotal ] = useState([]);
    const [ total, setTotal ] = useState(0);
    const [ list, setList ] = useState([]);
    const [ cartInfo, setCartInfo ] = useState(null);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const dispatch = useDispatch();

	const { refresh } = useSelector((state) => state.cart.value);
	const { RoleId } = useSelector((state) => state.user.value);

    const fetchCart = async() => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/cart`, {
                headers: {
                    authorization: `Bearer ${token}`
                }
            });
            setSubtotal(data?.subtotal);
            setTotal(data?.total);
            setList(data?.cart_items);
            setCartInfo(data?.cart);
        } catch (err) {
            
        }
    };
    const totalSubtotalValue = subtotal.reduce((total, item) => {
		const subtotalValue = parseInt(item.subtotal, 10);
		return total + subtotalValue;
	}, 0);

    const handleAbandon = async () => {
		try {
			await axios.patch(
				`${process.env.REACT_APP_API_BASE_URL}/cart/branch`,
				{ BranchId: parseInt(BranchId) },
				{
					headers: {
						authorization: `Bearer ${token}`,
					},
				}
			);
            dispatch(refreshCart());
		} catch (err) {
			toast.error(err.response.data.message, {
				position: "top-center",
				autoClose: 4000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "dark",
			});
		}
	};
    
    useEffect(() => {
        fetchCart();
    }, [ refresh ]);

    useEffect(() => {
        if (cartInfo?.BranchId !== +BranchId && cartInfo) onOpen();
    }, [ cartInfo ])
    
    return (
        <>
        {RoleId === 1 ? (
            <>
            <Stack overflowX={'hidden'} mx={{ base: "20px", md: "50px" }} my={{ base: "30px" }} gap={5}>
                <CartHeader total={total} />
                <Grid gap={5} templateColumns={{ base: '1fr', lg: '6fr 3fr'}}>
                    {total ? (
                        <>
                        <GridItem colSpan={1}>
                            <CartList list={list}/>
                        </GridItem>
                        <GridItem display={{ base: 'none', md: 'block' }} colSpan={1}>
                            <Receipt items={list} subtotal={totalSubtotalValue}/>
                        </GridItem>
                        </>
                    ) : (
                        <GridItem colSpan={{ base: 1, lg: 2 }}>
                            <EmptyCart/>
                        </GridItem>
                    )}
                </Grid>
            </Stack>
            <ReceiptMobile items={list} subtotal={totalSubtotalValue} />
                <Modal isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalCloseButton />
                        <ModalBody>
                            <Stack p={3} gap={5} w="100%" h="100%" justifyContent={"center"} alignItems={"center"}>
                                <Icon as={HiOutlineExclamationCircle} w="14" h="14" />
                                <Heading>Abandon Cart ?</Heading>
                                <Text textAlign={"center"} fontWeight={"light"}>
                                    You currently have an active cart on another branch. Are you sure you want to switch branch. Your previous cart will be cleared if you switch your branch location.
                                </Text>
                                <Flex w="100%" justifyContent={"center"} gap={3}>
                                    <Button onClick={onClose}>Cancel</Button>
                                    <ButtonTemp content={"Confirm"} onClick={handleAbandon} />
                                </Flex>
                            </Stack>
                        </ModalBody>
                    </ModalContent>
                </Modal>
            </>
        ) : (
            <ErrorPageLayout title={"404 - Page not found"} timer={5000}/>
        )}
        </>
    )
}
