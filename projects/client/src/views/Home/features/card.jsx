import { Stack, Text, Icon, Flex } from "@chakra-ui/react";

export const FeatureCard = ({ icon, title, description }) => {
  return (
    <>
      <Stack w="200px" display={{ base: "none", md: "block" }}>
        <Flex
          w="12"
          h="12"
          justifyContent={"center"}
          alignItems={"center"}
          borderRadius={"3"}
          bgColor={"gray.100"}
        >
          <Icon as={icon} color="black" w="8" h="8" />
        </Flex>
        <Text fontWeight={"medium"}>{title}</Text>
        <Text fontSize={"sm"} fontWeight={"normal"} color={"gray.500"}>
          {description}
        </Text>
      </Stack>
      <Flex
        gap={"6"}
        w="100%"
        alignItems={"center"}
        display={{ base: "flex", md: "none" }}
      >
        <Flex
          w="20"
          h="20"
          justifyContent={"center"}
          alignItems={"center"}
          borderRadius={"3"}
          bgColor={"gray.100"}
        >
          <Icon as={icon} color="black" w="12" h="12" />
        </Flex>
        <Stack gap={3}>
          <Text fontWeight={"medium"} fontSize={"xl"}>
            {title}
          </Text>
          <Text fontSize={"lg"} fontWeight={"normal"} color={"gray.500"}>
            {description}
          </Text>
        </Stack>
      </Flex>
    </>
  );
};