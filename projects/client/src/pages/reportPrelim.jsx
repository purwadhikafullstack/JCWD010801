import React, { useEffect, useState } from "react";
import { Orb } from "../components/orb/orb";
import { Flex, Stack, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const ReportPrelim = () => {
	const navigate = useNavigate();
	const [animateH, setAnimateH] = useState(false);
	const [animateD, setAnimateD] = useState(false);

	useEffect(() => {
		setAnimateH(true);
		setAnimateD(true);

		const redirectTimeout = setTimeout(() => {
			navigate("/dashboard/report-overview");
		}, 6000);

		return () => {
			clearTimeout(redirectTimeout);
		};
	}, [navigate]);

	return (
		<Flex
			w={"100vw"}
			h={"100vh"}
			alignContent={"center"}
			alignItems={"center"}
			justifyContent={"center"}
			justifyItems={"center"}
			flexDirection={"column"}
			bgColor={"black"}
		>
			<Stack w={"400px"} h={"400px"} mt={"-150px"} mb={"50px"}>
				<Orb />
			</Stack>
			<Stack>
				<Text className={`welcome-h ${animateH ? "animate-h" : ""}`}>ALPHAMART MANAGEMENT SYSTEM</Text>
				<Text className={`welcome-d ${animateD ? "animate-d" : ""}`} textAlign={"center"}>
					Data Visualization, Re-Imagined.
				</Text>
			</Stack>
		</Flex>
	);
};

export default ReportPrelim;
