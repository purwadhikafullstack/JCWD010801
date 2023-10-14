import { CategoryCarousel } from "./carousel";
import { Stack, Heading, Flex } from "@chakra-ui/react";
import { CreateCategory } from "../../../components/category/create";

export const Categories = () => {
  return (
    <Stack gap={10} w="100%">
      <Flex w='100%' justifyContent={'space-between'} alignItems={'center'} >
        <Heading fontSize={"3xl"} fontWeight={"semibold"}>
          Categories
        </Heading>
        <CreateCategory/>
      </Flex>
      <CategoryCarousel />
    </Stack>
  );
};