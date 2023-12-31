import { Stack } from "@chakra-ui/react";
import { CartCard } from "./card";
export const CartList = ({ list }) => {

    return (
        <Stack 
        borderRadius={'10px'} 
        w='100%' 
        h='auto'
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
                    price={Product?.price}
                    imgURL={Product?.imgURL}
                    weight={Product?.weight}
                    stock={Product?.Stocks[0].currentStock}
                    type={Product?.Discounts[0]?.type}
                    nominal={Product?.Discounts[0]?.nominal}
                    quantity={quantity}
                    lastCard={ list.length - 1 === idx ? true : false }
                    />
                )
            })}
        </Stack>
    )
}