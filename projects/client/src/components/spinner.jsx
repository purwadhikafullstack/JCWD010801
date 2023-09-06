import { Box } from "@chakra-ui/react";
import { SpinnerInfinity } from "spinners-react";

const Spinner = () => {
	return (
		<Box align={"center"} justify={"center"} my={"200px"}>
			<SpinnerInfinity
				size={250}
				thickness={70}
				speed={250}
				color="rgba(172, 57, 57, 1)"
				secondaryColor="rgba(0, 0, 0, 1)"
			/>
		</Box>
	);
};

export default Spinner;
