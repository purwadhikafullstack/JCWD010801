import { Flex, Stack, Text, Image, Icon } from "@chakra-ui/react";
import { UpdateCart } from "./update";
import { RemoveItem } from "./remove";
import { BsCircleFill } from "react-icons/bs";

export const CartCard = ({ id, name, imgURL, price, stock, weight, quantity, lastCard, type, nominal }) => {
    const countDiscount = () => {
        if (type === "Percentage") {
            const deductedPrice = nominal / 100 * (price * quantity)
            const postDiscount = (price * quantity) - deductedPrice
            return `Rp. ${(postDiscount.toLocaleString("id-ID"))}`
        } else if (type === "Numeric") {
            const postDiscount = (price * quantity) - nominal
            return ` Rp. ${(postDiscount.toLocaleString("id-ID"))}`   
        }
    };
    return (
        <>
        <Flex 
        w={"100%"}
        p={2}
        bgColor={'gray.50'} 
        gap={6} 
        borderBottom={lastCard ? null : '2px solid lightgray'}
        display={{ base: 'none', md: 'flex' }}>
            <Image 
            src={`${process.env.REACT_APP_BASE_URL}/products/${imgURL}`} 
            boxSize={'120px'} />
            <Flex 
            w='100%' 
            justifyContent={'space-between'} >
                <Flex 
                w={'320px'} 
                justifyContent={'space-between'} >
                    <Stack 
                    gap={0} 
                    justifyContent={'center'} 
                    w={'100px'}>
                        <Text fontSize={'xl'} fontWeight={'semibold'} mb={0}>
                            {name}
                        </Text>
                        <Text fontSize={'sm'} fontWeight={'medium'} color={'blackAlpha.700'} mb={1}>
                            {weight} kg
                        </Text>
                        <Text fontSize={'sm'} fontWeight={'medium'} color={'blackAlpha.700'}>
                            {stock} in stock
                        </Text>
                    </Stack>
                    <Flex 
                    justifyContent={'center'} 
                    gap={4} 
                    alignItems={'center'}>
                        <UpdateCart isExtra={type === "Extra" ? true : false} qty={quantity} ProductId={id} stock={stock}/>
                    </Flex>
                </Flex>
                <Stack w='150px' justifyContent={'space-between'}>
                    <RemoveItem ProductId={id} name={name} position={'absolute'}alignSelf={'end'} />
                    <Flex color={'gray.50'} >.</Flex>
                    {type === "Numeric" || type === "Percentage" ? (
                        <Stack mr={3} gap={0} textAlign={"end"}>
                            <Text fontSize={'xl'} fontWeight={'semibold'} mb={0}>
                                {countDiscount()}
                            </Text>
                            <Text as={"s"} color={"gray"} fontSize={'sm'} fontWeight={'normal'} mb={0}>
                                {`Rp. ${(price * quantity)?.toLocaleString("id-ID")}`}
                            </Text>
                        </Stack>

                    ) : (
                        <Text mr={3} textAlign={"end"} fontSize={'xl'} fontWeight={'semibold'} mb={0}>
                            {`Rp. ${(price * quantity)?.toLocaleString("id-ID")}`}
                        </Text>
                    )}
                    <Flex color={'gray.50'} >.</Flex>
                </Stack>
            </Flex>
        </Flex>

        {/* Mobile display */}
        <Stack
        w={"100%"}
        py={4}
        gap={1}
        display={{ base: 'flex', md: 'none' }}
        borderBottom={lastCard ? null : '2px solid lightgray'}>
            <Flex 
            w={"100%"}
            p={2}
            bgColor={'gray.50'} 
            gap={6} >
                <Image 
                src={`${process.env.REACT_APP_BASE_URL}/products/${imgURL}`} 
                boxSize={'120px'}/>
                <Stack 
                gap={0}
                w='100%'>
                    <Flex mb={0} alignItems={'center'} w='100%' justifyContent={'space-between'}>
                        <Text fontSize={'xl'} fontWeight={'semibold'} mb={0}>
                            {name}
                        </Text>
                        <RemoveItem ProductId={id} name={name} />
                    </Flex>
                    <Flex mb={3} gap={2} alignItems={'center'}>
                        <Text fontSize={'sm'} fontWeight={'medium'} color={'blackAlpha.700'}>
                            {weight} kg
                        </Text>
                        <Icon as={BsCircleFill} color={'black'} w='1' h='1' />
                        <Text fontSize={'sm'} fontWeight={'medium'} color={'blackAlpha.700'}>
                            {stock} in stock
                        </Text>
                    </Flex>
                    <UpdateCart isExtra={type === "Extra" ? true : false} qty={quantity} ProductId={id} stock={stock}/>
                </Stack>
            </Flex>
            <Flex bgColor={'gray.50'} p={2} w='100%' justifyContent={'space-between'} alignItems={'center'}>
                <Text fontSize={'xl'} fontWeight={'semibold'} mb={0}>
                    {`Price`}
                </Text>
                {type === "Numeric" || type === "Percentage" ? (
                    <Stack mr={3} gap={0} textAlign={"end"}>
                        <Text fontSize={'xl'} fontWeight={'semibold'} mb={0}>
                            {countDiscount()}
                        </Text>
                        <Text as={"s"} color={"gray"} fontSize={'sm'} fontWeight={'normal'} mb={0}>
                            {`Rp. ${(price * quantity)?.toLocaleString("id-ID")}`}
                        </Text>
                    </Stack>

                ) : (
                    <Text mr={3} textAlign={"end"} fontSize={'xl'} fontWeight={'semibold'} mb={0}>
                        {`Rp. ${(price * quantity)?.toLocaleString("id-ID")}`}
                    </Text>
                )}
            </Flex>
        </Stack>
        </>
    )
}