import { Grid, GridItem, Stack } from "@chakra-ui/react"
import { CartHeader } from "./components/header"
import axios from "axios"
import { CartList } from "./components/list"
import { Receipt } from "./components/receipt"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { ReceiptMobile } from "./components/receiptMobile"
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { EmptyCart } from "./components/empty"

export const CartPageView = () => {
    const token = localStorage.getItem("token");
    const [ subtotal, setSubtotal ] = useState(0);
    const { refresh } = useSelector((state) => state.cart.value);

    const fetchSubtotal = async() => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/cart`, {
                headers: {
                    authorization: `Bearer ${token}`
                }
            });
            setSubtotal(parseInt(data.subtotal[0].subtotal));
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
    };
    
    useEffect(() => {
        fetchSubtotal();
    }, [ refresh ]);
    
    return (
        <>
        <Stack overflowX={'hidden'} mx={{ base: "20px", md: "50px" }} my={{ base: "30px" }} gap={5}>
            <CartHeader />
            <Grid gap={5} templateColumns={{ base: '1fr', lg: '6fr 3fr'}}>
                {subtotal ? (
                    <>
                    <GridItem colSpan={1}>
                        <CartList/>
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
    )
}