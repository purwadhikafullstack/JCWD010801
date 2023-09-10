import { CategoryCarousel } from "./carousel";
import { Stack, Heading } from "@chakra-ui/react";
import { HomeCategoryPrototype } from "./test";
import { CreateCategory } from "../../../components/category/create";

export const Categories = () => {
  return (
    <Stack gap={"3"} w="100%">
      <Heading fontSize={"3xl"} fontWeight={"semibold"}>
        Categories
      </Heading>
      <CreateCategory/>
      <CategoryCarousel />
      <HomeCategoryPrototype/>
    </Stack>
  );
};