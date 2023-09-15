import { Flex, Stack, Text } from "@chakra-ui/react";
import { ButtonTemp } from "../../../components/button";
import { PromoCode } from "./voucher";
import { useNavigate } from "react-router-dom";

export const Receipt = ({ subtotal, promo = true }) => {
    const navigate = useNavigate();
    const convertToRp = (number) => number.toLocaleString("id-ID");

    return (
        <Stack display={subtotal === 0 ? 'none' : 'flex'}  p={5} w={'100%'} borderRadius={'10px'} boxShadow={promo ? 'md' : null} gap={3}>
            { promo && (<PromoCode />) }
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
                    {/* { ( subtotal / 10 )? } */}
                    -
                </Text>
            </Flex>
            <Flex borderBottom={'2px solid lightgray'} pb={5} w={'100%'} justifyContent={'space-between'}>
                <Text>
                    Estimated Sales Tax
                </Text>
                <Text>
                    { `Rp. ${convertToRp( subtotal / 10 )}`}
                </Text>
            </Flex>
            <Flex mb={3} fontWeight={'semibold'} w={'100%'} justifyContent={'space-between'}>
                <Text>
                    Estimated Total
                </Text>
                <Text>
                    { `Rp. ${convertToRp( subtotal + (subtotal / 10) )}`}
                </Text>
            </Flex>
            <ButtonTemp w={'100%'} content={"CHECK OUT"} onClick={() => navigate("/order")} />
        </Stack>
    )
}