import { Stack } from "@chakra-ui/react";
import axios from "axios";
import { useState, useEffect } from "react";
import { CartCard } from "./card";
import { useSelector } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

export const CartList = ({ list }) => {

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