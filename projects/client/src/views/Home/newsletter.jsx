import * as Yup from "yup";
import { Flex, Stack, Input, Button, InputGroup, InputLeftElement, Icon, Text, Heading } from "@chakra-ui/react";
import { Formik, Form, ErrorMessage, Field } from "formik";
import { MdOutlineEmail } from "react-icons/md";

export const Newsletter = () => {
	const emailSchema = Yup.object().shape({
		email: Yup.string().email("Invalid e-mail format.").required("Please enter your e-mail."),
	});
	return (
		<Stack alignItems={"center"} gap={"2rem"}>
			<Stack justifyContent={"center"} alignItems={"center"} w={{ base: "300px", md: "400px", lg: "500px" }}>
				<Heading
					mb={"10px"}
					textAlign={"center"}
					fontSize={{ base: "xl", md: "2xl", lg: "3xl" }}
					fontWeight={"semibold"}
				>
					Subscribe to our newsletter to get our latest updates
				</Heading>
				<Text
					mb={"30px"}
					textAlign={"center"}
					fontSize={{ base: "xs", md: "sm", lg: "md" }}
					fontWeight={"medium"}
					color={"gray.500"}
				>
					You don't want to miss out on some voucher codes and flash sales
				</Text>
				<Formik initialValues={{ email: "" }} validationSchema={emailSchema} onSubmit={(value, action) => {}}>
					{() => {
						return (
							<Form>
								<Flex>
									<InputGroup>
										<InputLeftElement>
											<Icon as={MdOutlineEmail} w="4" h="4" color={"gray.500"} />
										</InputLeftElement>
										<Input
											color={"gray.500"}
											bgColor={"gray.100"}
											name="email"
											as={Field}
											borderRadius={"md"}
											focusBorderColor="gray.300"
											placeholder="Enter your e-mail here"
										/>
										<ErrorMessage name="email" style={{ color: "red" }} />
									</InputGroup>
									<Button type="submit" bgColor={"black"} borderRadius={"md"}>
										<Text fontWeight={"light"} color={"white"}>
											Subscribe
										</Text>
									</Button>
								</Flex>
							</Form>
						);
					}}
				</Formik>
			</Stack>
		</Stack>
	);
};
