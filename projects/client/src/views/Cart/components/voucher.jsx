import { Input, Flex, Stack, Text, Icon } from "@chakra-ui/react"
import { ButtonTemp } from "../../../components/button"
import { TbDiscount2 } from "react-icons/tb";
import { MdKeyboardArrowRight } from "react-icons/md";

export const PromoCode = () => {
    const voucher = {};

    return (
        <Stack w={'100%'} gap={0} borderBottom={'2px solid lightgray'} pb={3}>
            <Text mb={2} fontWeight={'semibold'} fontSize={'sm'}>
                Enter Promo Code
            </Text>
            <Flex mb={2} w={'100%'} gap={2}>
                <Input
                    color={"gray.500"}
                    bgColor={"gray.100"}
                    name="voucher"
                    focusBorderColor="gray.300"
                    placeholder="Promo Code"
                />
                <ButtonTemp content={<Text fontWeight={"light"}>Submit</Text>} />
            </Flex>
            <Text fontWeight={'semibold'} fontSize={'lg'} mb={1}>
                Promotions
            </Text>
            <Flex cursor={'pointer'} border={'2px solid lightgray'} borderRadius={'10px'} p={1} w={'100%'} justifyContent={'space-between'} alignItems={'center'}>
                <Flex ml={2} gap={3} alignItems={'center'}>
                    <Icon as={TbDiscount2} w='7' h='7' color={'black'} />
                    <Text>
                        {voucher.id ? voucher.name : 'Save more using promos'}
                    </Text>
                </Flex>
                <Flex justifyContent={'center'} alignItems={'center'} p={2} borderLeft={'2px solid lightgray'}>
                    <Icon as={MdKeyboardArrowRight} w='8' h='8' color={'lightgray'}/>
                </Flex>
            </Flex>
        </Stack>
    )
}