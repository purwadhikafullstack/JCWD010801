import { Heading, Stack, Text } from "@chakra-ui/react"
import { VoucherList } from "./components/list"
import { RedeemCode } from "./components/redeemCode"

export const VoucherPageView = () => {
    return (
        <Stack overflowX={'hidden'} mx={{ base: "10px", md: "30px" }} my={{ base: "30px" }} gap={4}>
			<Heading fontWeight={"semibold"}>
                My Vouchers
            </Heading>
            <Text mb={2} fontWeight={'semibold'} fontSize={'sm'}>
                Enter Promo Code
            </Text>
            <RedeemCode/>
            <VoucherList/>
		</Stack>
    )
}