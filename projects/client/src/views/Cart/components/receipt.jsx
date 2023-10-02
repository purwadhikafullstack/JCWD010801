import { Flex, Stack, Text } from "@chakra-ui/react";
import { ButtonTemp } from "../../../components/button";
import { useNavigate } from "react-router-dom";
import { Promo } from "./promo";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

export const Receipt = ({ subtotal, promo = true }) => {
    const navigate = useNavigate();
    const convertToRp = (number) => number?.toLocaleString("id-ID");
    const [ discount, setDiscount ] = useState(0);
    // let discount;

    const voucher = useSelector((state) => state.voucher.value);
    // const discountedPrice = () => {
    //     if ( voucher.isPercentage ) {
	// 		if ((subtotal * voucher.nominal / 100) > voucher.maxDisc) return discount = (voucher.maxDisc)
	// 		else return discount = (subtotal * voucher.nominal / 100)
	// 	} 
	// 	else discount = (voucher.nominal)
    // };
    const discountedPrice = () => {
        if ( voucher.isPercentage ) {
			if ((subtotal * voucher.nominal / 100) > voucher.maxDisc) return setDiscount(voucher.maxDisc)
			else return setDiscount(subtotal * voucher.nominal / 100)
		} 
		else setDiscount(voucher.nominal)
    };

    const tax = voucher.VoucherId ? (subtotal - discount) / 10 : (subtotal) / 10;
	const total = voucher.VoucherId ? tax + (subtotal - discount) : tax + (subtotal) ;

    useEffect(() => {
        discountedPrice();
    }, [voucher])

    return (
        <Stack display={subtotal === 0 ? 'none' : 'flex'}  p={5} w={'100%'} borderRadius={'10px'} boxShadow={promo ? 'md' : null} gap={3}>
            { promo && (<Promo/>) }
            <Flex w={'100%'} justifyContent={'space-between'}>
                <Text>
                    Subtotal
                </Text>
                <Text fontWeight={'medium'}>
                    {`Rp. ${convertToRp(subtotal)}`}
                </Text>
            </Flex>
            <Flex color={'red'} w={'100%'} justifyContent={'space-between'}>
                <Text>
                    Shopping Discount
                </Text>
                <Text>
                    {voucher.VoucherId ? `Rp. ${convertToRp(discount)}` : "-"}
                </Text>
            </Flex>
            <Flex borderBottom={'2px solid lightgray'} pb={5} w={'100%'} justifyContent={'space-between'}>
                <Text>
                    Estimated Sales Tax
                </Text>
                <Text>
                    { `Rp. ${convertToRp(tax)}`}
                </Text>
            </Flex>
            <Flex mb={3} fontWeight={'semibold'} w={'100%'} justifyContent={'space-between'}>
                <Text>
                    Estimated Total
                </Text>
                <Text>
                    { `Rp. ${convertToRp(total)}`}
                </Text>
            </Flex>
            <ButtonTemp w={'100%'} content={"CHECK OUT"} onClick={() => navigate("/checkout")} />
        </Stack>
    )
}