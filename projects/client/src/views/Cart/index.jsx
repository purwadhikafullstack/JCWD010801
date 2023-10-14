import { Grid, GridItem, Stack } from "@chakra-ui/react"
import { CartHeader } from "./components/header"
import axios from "axios"
import { CartList } from "./components/list"
import { Receipt } from "./components/receipt"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { ReceiptMobile } from "./components/receiptMobile"
import { EmptyCart } from "./components/empty"
import { ErrorPageLayout } from "../../components/errorLayout"

export const CartPageView = () => {
    const token = localStorage.getItem("token");
    const [ subtotal, setSubtotal ] = useState([]);
    const [ total, setTotal ] = useState(0);
    const [ list, setList ] = useState([]);

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
        } catch (err) {
            
        }
    };
    const totalSubtotalValue = subtotal.reduce((total, item) => {
		const subtotalValue = parseInt(item.subtotal, 10);
		return total + subtotalValue;
	}, 0);
    
    useEffect(() => {
        fetchCart();
    }, [ refresh ]);
    
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
            </>
        ) : (
            <ErrorPageLayout title={"404 - Page not found"} timer={5000}/>
        )}
        </>
    )
}