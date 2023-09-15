import { Drawer, DrawerBody, DrawerContent, DrawerOverlay, Flex, Icon, Stack, Text, useDisclosure } from "@chakra-ui/react"
import { ButtonTemp } from "../../../components/button";
import { MdKeyboardArrowRight, MdKeyboardArrowUp } from "react-icons/md";
import { Receipt } from "./receipt";
import { TbDiscount2 } from "react-icons/tb";

export const ReceiptMobile = ({ subtotal }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const voucher = {};

    return (
        <>
        <Stack 
        w='100%' 
        display={subtotal === 0 ? 'none' : { base: 'flex', lg: 'none' }} 
        flexDir={'column'}
        position={'fixed'} 
        bgColor={'white'}
        bottom={0} 
        p={3}
        pt={5}
        zIndex={10}>
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
            <Flex w='100%' p={2} alignItems={'center'}>
                <Stack onClick={onOpen} gap={0} w='50%'>
                    <Text fontSize={'sm'}>
                        Estimated Total
                    </Text>
                    <Flex alignItems={'center'} gap={2}>
                        <Text fontSize={'xl'} fontWeight={'semibold'}>
                            {`Rp. ${( subtotal + (subtotal / 10) ).toLocaleString("id-ID")}`}
                        </Text>
                        <Icon as={MdKeyboardArrowUp} w='5' h='5' />
                    </Flex>
                </Stack>
                <ButtonTemp w={'50%'} content={'CHECK OUT'} />
            </Flex>
        </Stack>
        <Drawer placement="bottom" isOpen={isOpen} onClose={onClose}>
            <DrawerOverlay/>
            <DrawerContent borderTopRadius={'30px'}>
                <DrawerBody>
                    <Flex pt={2} justifyContent={'center'} w={"100%"}>
                        <Flex onClick={onClose} rounded={"full"} w={"20%"} h={"5px"} bgColor={"gray.300"} color={"gray.300"}>.</Flex>
                    </Flex>
                    <Receipt subtotal={subtotal} promo={false}/>
                </DrawerBody>
            </DrawerContent>
        </Drawer>
        </>
    )
}