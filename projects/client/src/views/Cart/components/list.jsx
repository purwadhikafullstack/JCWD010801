import { Stack } from "@chakra-ui/react";
import axios from "axios";
import { useState, useEffect } from "react";
import { CartCard } from "./card";
import { useSelector } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

export const CartList = () => {
    const token = localStorage.getItem("token");
    const [ list, setList ] = useState([]);
    const { refresh } = useSelector((state) => state.cart.value);

    const fetchData = async() => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/cart`, {
                headers: {
                    authorization: `Bearer ${token}`
                }
            });
            setList(data.cart_items);
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
        fetchData();
    }, [ refresh ]);

    return (
        <Stack 
        borderRadius={'10px'} 
        w='100%' 
        h='auto'
        gap={2}
        overflowY={list.length > 4 ? 'auto' : 'none'}
        sx={
            { 
           '::-webkit-scrollbar':{
                  display:'none'
              }
           }
        }>
            {list.map(({ Product, quantity }, idx) => {
                return (
                    <CartCard 
                    key={idx}
                    id={Product?.id}
                    name={Product?.productName} 
                    price={Product?.price?.toLocaleString("id-ID")}
                    imgURL={Product?.imgURL}
                    weight={Product?.weight}
                    stock={Product?.Stocks[0].currentStock}
                    quantity={quantity}
                    lastCard={ list.length - 1 === idx ? true : false }
                    />
                )
            })}
        </Stack>
    )
}