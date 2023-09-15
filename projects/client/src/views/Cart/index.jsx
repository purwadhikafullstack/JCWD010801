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
    const [ subtotal, setSubtotal ] = useState(0);
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
            setSubtotal(parseInt(data.subtotal[0].subtotal));
            setTotal(data.total);
            setList(data.cart_items);
        } catch (err) {
            
        }
    };
    
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
                    {subtotal ? (
                        <>
                        <GridItem colSpan={1}>
                            <CartList list={list}/>
                        </GridItem>
                        <GridItem display={{ base: 'none', lg: 'block' }} colSpan={1}>
                            <Receipt subtotal={subtotal}/>
                        </GridItem>
                        </>
                    ) : (
                        <GridItem colSpan={{ base: 1, lg: 2 }}>
                            <EmptyCart/>
                        </GridItem>
                    )}
                </Grid>
            </Stack>
            <ReceiptMobile subtotal={subtotal} />
            </>
        ) : (
            <ErrorPageLayout title={"404 - Page not found"} timer={5000}/>
        )}
        </>
    )
}