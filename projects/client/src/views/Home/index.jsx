import { Stack } from "@chakra-ui/react";
import { Banner } from "./banner";
import { Features } from "./features";
import { Categories } from "./categories";
import { Suggestion } from "./products";
import { Newsletter } from "./newsletter";

export const HomePageView = () => {
	return (
		<Stack overflowX={'hidden'} mx={{ base: "10px", md: "30px", lg: "100px" }} my={{ base: "30px" }} gap={"4rem"}>
			<Banner />
			<Suggestion />
			<Features />
			<Categories />
			<Newsletter />
		</Stack>
	);
};
