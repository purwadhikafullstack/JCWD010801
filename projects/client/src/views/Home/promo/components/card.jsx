import { Box, Flex, Text, Stack, Spacer } from "@chakra-ui/react"
import { useNavigate } from "react-router-dom";
import { AddToCartButton } from "../../../../components/cart/add";

export const ProductCard = ({ Product, type = "", nominal = 0, validUntil, ProductId }) => {
    const navigate = useNavigate();

    const handleType = () => {
        if (type === "Extra") return `BUY 1 GET ${nominal} FREE`;
        if (type === "Numeric") return (`- ${nominal.toLocaleString("id-ID")} IDR`);
        if (type === "Percentage") return (`${nominal}% OFF`);
    };

    const countDiscount = () => {
        if (type === "Percentage") {
            const deductedPrice = nominal / 100 * Product?.price
            const postDiscount = Product?.price - deductedPrice
            return `Rp. ${(postDiscount.toLocaleString("id-ID"))}`
        } else if (type === "Numeric") {
            const postDiscount = Product?.price - nominal
            return ` Rp. ${(postDiscount.toLocaleString("id-ID"))}`   
        }
    }

    return (
        <Stack
        borderRadius={'lg'}
        w={{ base: '150px', sm: '180px', md: '240px' }}
        h={{ base: '335px', sm: '365px', md: '380px' }}
        m={0}
        justifyContent={"space-between"}
        >
            <Box
            display={'flex'}
            flexWrap={'wrap'}
            borderRadius={'lg'}
            w={{ base: '150px', sm: '180px', md: '240px' }}
            minH={{ base: '150px', sm: '180px', md: '240px' }}
            bgImage={`${process.env.REACT_APP_BASE_URL}/products/${Product?.imgURL}`}
            bgSize={'cover'}
            bgPosition={'center'}
            bgRepeat={'no-repeat'}
            p={{ base: 1, sm: 2, md: 3 }}
            >
                {type && (
                    <Flex h={"min"} alignItems={"center"} justifyContent={"center"} bgColor={"red.500"} borderRadius={"inherit"} px={3}>
                        <Text fontSize={{ base: "13px", sm: "15px", md: "18px" }} textAlign={"center"} color={"white"}>{handleType()}</Text>
                    </Flex>
                )}
            </Box>
            <Stack mb={2} textAlign={"left"}>
                <Text
                fontWeight={"semibold"}
                onClick={() => navigate(`/product/${ProductId}`)}
                cursor={"pointer"}
                _hover={{ textDecoration: "underline" }}
                >
                    {Product?.productName}
                </Text>
                {type === "Numeric" || type === "Percentage" ? (
                    <Flex direction={{ base: "column-reverse", sm: "row" }} gap={{ base: 1, sm: 3 }}>
                        <Text fontSize={"18px"} fontWeight={"bold"}>{countDiscount()}</Text>
                        <Text fontSize={"14px"} as={"s"} color={"gray"} >{`Rp. ${Product?.price.toLocaleString("id-ID")}`}</Text>
                    </Flex>
                    ) : (
                    <Text fontSize={"18px"} fontWeight={"bold"}>{`Rp. ${Product?.price.toLocaleString("id-ID")}`}</Text>
                )}
            </Stack>
            <Spacer/>
            <AddToCartButton 
            ProductId={ProductId}
            name={Product?.productName}
            quantity={1}
            isText
            />
        </Stack>
    )
}