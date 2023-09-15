import { Stack, Text } from "@chakra-ui/react";
import { BsCart4 } from "react-icons/bs";
import { Link } from "react-router-dom";

export const EmptyCart = () => {
    return (
        <Stack w={"100%"} my={5} justifyContent={"center"} alignItems={"center"}>
            <BsCart4 size={'80px'} />
            <Text mt={6} fontWeight={"semibold"} color={"gray"} fontSize={"xl"} textAlign={"center"}>
                You have no items in your cart.
            </Text>
            <Text fontWeight={"semibold"} color={"gray"} fontSize={"xl"} textAlign={"center"}>
                Click <Text as={Link} to={"/search"} color={"blackAlpha.800"} _hover={{ color: "black" }}>here</Text> to start shopping.
            </Text>
        </Stack>
    )
}