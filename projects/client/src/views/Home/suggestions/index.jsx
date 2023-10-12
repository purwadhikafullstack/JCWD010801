import { Stack, Heading, Flex } from "@chakra-ui/react";
import { SuggestionsCarousel } from "./components/carousel";

export const Suggestion = () => {
  return (
    <Stack gap={5} w="100%">
      <Flex w='100%' alignItems={'center'} >
        <Heading fontSize={"3xl"} fontWeight={"semibold"}>
          You Might Like
        </Heading>
      </Flex>
      <SuggestionsCarousel />
    </Stack>
  );
};