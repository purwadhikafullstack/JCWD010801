import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Center, Text, Flex, Image } from "@chakra-ui/react";
import { CircularProgress } from "@chakra-ui/react";
import logo from "../assets/public/AM_logo_trans.png";
export const ErrorPageLayout = ({ title }) => {
	const navigate = useNavigate();
	useEffect(() => {
		const timer = setTimeout(() => {
			navigate("/");
		}, 5000);
		return () => {
			if (timer) {
				clearTimeout(timer);
			}
		};
	}, []);

	return (
		<Center
			flexDirection="column"
			textAlign="center"
			paddingX={{ base: 4, md: 8 }}
		>
			<Image src={logo} alt="logo" w={"300px"} />
			<Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="bold">
				{title}
			</Text>
			<Text fontSize={{ base: "md", md: "lg" }}>
				The page you are looking for does not exist.
			</Text>
			<Flex alignItems="center" justifyContent="center" mt="4">
				<Text fontSize={{ base: "sm", md: "md" }}>
					Redirecting to homepage in 5 seconds...
				</Text>
				<CircularProgress
					isIndeterminate
					color="black"
					size="40px"
					thickness="5px"
					ml="2"
				/>
			</Flex>
		</Center>
	);
};
