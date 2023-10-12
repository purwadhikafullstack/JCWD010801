import { Stack, Heading, Flex } from "@chakra-ui/react";
import { DiscountCarousel } from "./components/carousel";

export const HomePromos = () => {
  return (
    <Stack gap={5} w="100%">
      <Flex w='100%' alignItems={'center'} >
        <Heading fontSize={"3xl"} fontWeight={"semibold"}>
          On Sale
        </Heading>
      </Flex>
      <DiscountCarousel />
    </Stack>
  );
};