import { Flex, Stack, Text, Heading, Grid, GridItem } from "@chakra-ui/react";
import { FeatureCard } from "./card";
import { BsTruck } from "react-icons/bs";
import { FaHandHoldingHeart } from "react-icons/fa";
import { GiFruitBowl, GiReceiveMoney } from "react-icons/gi";

export const Features = () => {
  return (
    <Stack w="100%" gap={{ base: 0, lg: 10 }}>
      <Flex
        wrap={{ base: "wrap", lg: "nowrap" }}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Heading fontSize={"3xl"} fontWeight={"semibold"}>
          Why Alphamart?
        </Heading>
        <Flex
          h="20"
          alignItems={"center"}
          borderLeft={{ base: "none", md: "3px solid black" }}
        >
          <Text
            ml={{ base: 0, md: "10" }}
            color={"gray.500"}
            fontSize={{ base: "sm", lg: "lg" }}
          >
            We ensure our customer have the best shopping experience
          </Text>
        </Flex>
      </Flex>
      <Grid
        w="100%"
        gap={{ base: 5, lg: 0 }}
        h="100%"
        templateColumns={{
          base: "1fr",
          sm: "repeat(2, 1fr)",
          lg: "repeat(4, 1fr)",
        }}
        templateRows={{
          base: "repeat(4, 1fr)",
          sm: "repeat(2, 1fr)",
          lg: "1fr",
        }}
      >
        <GridItem justifySelf={"center"} colSpan={1} rowSpan={1}>
          <FeatureCard
            icon={GiFruitBowl}
            title={"Freshness Guaranteed"}
            description={"We pick only the freshest groceries."}
          />
        </GridItem>
        <GridItem justifySelf={"center"} colSpan={1} rowSpan={1}>
          <FeatureCard
            icon={FaHandHoldingHeart}
            title={"Handled with Care"}
            description={
              "Great and quality products picked and handled with care."
            }
          />
        </GridItem>
        <GridItem justifySelf={"center"} colSpan={1} rowSpan={1}>
          <FeatureCard
            icon={BsTruck}
            title={"Quick Shipping"}
            description={
              "We offer fast and free shipping for our loyal customers."
            }
          />
        </GridItem>
        <GridItem justifySelf={"center"} colSpan={1} rowSpan={1}>
          <FeatureCard
            icon={GiReceiveMoney}
            title={"Budget Friendly"}
            description={
              "Your favourite products made affordable just for you."
            }
          />
        </GridItem>
      </Grid>
    </Stack>
  );
};