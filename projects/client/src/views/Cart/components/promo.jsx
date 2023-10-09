import { Stack, Text } from "@chakra-ui/react"
import { SelectVoucher } from "../../Voucher/components/selectVoucher";
import { RedeemCode } from "../../Voucher/components/redeemCode";

export const Promo = ({ subtotal, checkRequirements }) => {

    return (
        <Stack w={'100%'} gap={0} borderBottom={'2px solid lightgray'} pb={3}>
            <Text mb={2} fontWeight={'semibold'} fontSize={'sm'}>
                Enter Promo Code
            </Text>
            <RedeemCode/>
            <Text fontWeight={'semibold'} fontSize={'lg'} mb={1}>
                Promotions
            </Text>
            <SelectVoucher checkRequirements={checkRequirements} subtotal={subtotal}/>
        </Stack>
    )
}