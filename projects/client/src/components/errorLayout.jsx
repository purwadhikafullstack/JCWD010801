import { useEffect, useState } from "react"; // Import useState
import { useNavigate } from "react-router-dom";
import { Center, Text, Flex, Image } from "@chakra-ui/react";
import { CircularProgress } from "@chakra-ui/react";
import logo from "../assets/public/AM_logo_trans.png";

export const ErrorPageLayout = ({ title, timer }) => {
	const navigate = useNavigate();
	const [countdown, setCountdown] = useState(timer / 1000);

	useEffect(() => {
		const interval = setInterval(() => {
			setCountdown((prevCountdown) => prevCountdown - 1);
		}, 1000);
		if (countdown === 0) {
			navigate("/");
		}
		return () => {
			clearInterval(interval);
		};
	}, [countdown]);

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
					Redirecting to homepage in {countdown} seconds...
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
