import { Heading, Stack, Text } from "@chakra-ui/react";

export const NoPaymentProof = () => {
	return (
		<Stack w={"100%"} my={5} justifyContent={"center"} alignItems={"center"}>
			<Heading fontSize={"70px"}>{":("}</Heading>
			<Text mt={6} fontWeight={"semibold"} color={"gray"} fontSize={"xl"} textAlign={"center"}>
				No Payment Proof Available
			</Text>
			<Text fontWeight={"semibold"} color={"gray"} fontSize={"15px"} textAlign={"center"}>
				Customer has not completed the payment
			</Text>
		</Stack>
	);
};
