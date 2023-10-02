import { Flex, Text, Icon, useDisclosure, Drawer, DrawerOverlay, DrawerContent, DrawerHeader, Stack, Heading } from "@chakra-ui/react"
import { TbDiscount2 } from "react-icons/tb";
import { MdKeyboardArrowRight } from "react-icons/md";
import { useSelector } from "react-redux";
import { VoucherList } from "./list";
import { FiArrowLeft } from "react-icons/fi";
import { RedeemCode } from "./redeemCode";

export const SelectVoucher = () => {
    const voucher = useSelector((state) => state.voucher.value);
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
        <Flex onClick={onOpen} cursor={'pointer'} border={'2px solid lightgray'} borderRadius={'10px'} p={1} w={'100%'} justifyContent={'space-between'} alignItems={'center'}>
            <Flex ml={2} gap={3} alignItems={'center'}>
                <Icon as={TbDiscount2} w='7' h='7' color={'black'} />
                <Text>
                    {voucher.name ? voucher.name : 'Save more using promos'}
                </Text>
            </Flex>
            <Flex justifyContent={'center'} alignItems={'center'} p={2} borderLeft={'2px solid lightgray'}>
                <Icon as={MdKeyboardArrowRight} w='8' h='8' color={'lightgray'}/>
            </Flex>
        </Flex>
        <Drawer placement="bottom" isOpen={isOpen} onClose={onClose}>
            <DrawerOverlay>
                <DrawerContent w={"100vw"} h={"100vh"} overflowY={"auto"} alignItems={"center"} p={{base: 1, md: 4}}>
                    <DrawerHeader alignSelf={"start"}>
                        <Flex gap={5} mb={5} alignItems={"center"}>
                            <Icon cursor={"pointer"} w={10} h={10} as={FiArrowLeft} onClick={onClose}/>
                            <Heading fontWeight={"semibold"}>
                                My Vouchers
                            </Heading>
                        </Flex>
                    </DrawerHeader>
                    <Stack w={"90%"} gap={3}>
                    <Text fontWeight={'semibold'} fontSize={'md'}>
                        Enter Promo Code
                    </Text>
                        <RedeemCode />
                        <VoucherList/>
                    </Stack>
                </DrawerContent>
            </DrawerOverlay>
        </Drawer>
        </>
    )
}