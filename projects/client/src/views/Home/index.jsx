import { Banner } from "./banner";
import { Stack } from "@chakra-ui/react";
import { Features } from "./features";
import { Categories } from "./categories";
import { Suggestion } from "./products";
import { Newsletter } from "./newsletter";

export const HomepageView = () => {
  return (
    <Stack
      mx={{ base: "10px", md: "30px", lg: "50px" }}
      my={{ base: "30px" }}
      gap={"4rem"}
    >
      <Banner />
      <Suggestion />
      <Features />
      <Categories />
      <Newsletter />
    </Stack>
  );
};
