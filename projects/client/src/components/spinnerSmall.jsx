import { Flex } from "@chakra-ui/react";
import { SpinnerInfinity } from "spinners-react";

const SpinnerSmall = () => {
	return (
		<Flex align={"center"} justify={"center"} w={"650px"} h={"320px"} ml={"20px"}>
			<SpinnerInfinity
				size={200}
				thickness={70}
				speed={100}
				color="rgba(172, 57, 57, 1)"
				secondaryColor="rgba(0, 0, 0, 1)"
			/>
		</Flex>
	);
};

export default SpinnerSmall;
