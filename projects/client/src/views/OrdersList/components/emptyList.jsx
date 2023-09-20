import { Heading, Stack, Text } from "@chakra-ui/react";

export const EmptyList = () => {
	return (
		<Stack w={"100%"} my={5} justifyContent={"center"} alignItems={"center"}>
			<Heading fontSize={"70px"}>{":("}</Heading>
			<Text mt={6} fontWeight={"semibold"} color={"gray"} fontSize={"xl"} textAlign={"center"}>
				Sorry, there are no items that match your search
			</Text>
			<Text fontWeight={"semibold"} color={"gray"} fontSize={"15px"} textAlign={"center"}>
				Please check your search parameters
			</Text>
		</Stack>
	);
};
