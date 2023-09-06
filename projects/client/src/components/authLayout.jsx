import source from "../assets/public/AM_bg_login.png";
import sourceLogo from "../assets/public/AM_logo_white.png";
import sourceLogoBlack from "../assets/public/AM_logo_trans.png";
import sourceGraphic from "../assets/public/AM_graphic.png";
import { Image, Flex, Box } from "@chakra-ui/react";

export const AuthLayout = ({ component }) => {
  return (
    <>
      <Image w={"full"} h={"100vh"} src={source} position={"absolute"} />
      <Flex h={"100vh"} justifyContent={"center"} position={"relative"}>
        <Box
          display={{ base: "none", md: "block", lg: "block" }}
          w={["200px", "300px", "400px"]}
          h={["500px"]}
          bg={"#373433"}
          marginY={"auto"}
          boxShadow="0px 0px 10px black"
        >
          <Flex mt={"50px"} justifyContent={"center"}>
            <Image
              w={["100px", "200px", "300px"]}
              src={sourceLogo}
              transition="transform 0.3s ease-in-out"
              _hover={{ transform: "scale(1.1)" }}
            />
          </Flex>
          <Flex mt={"56.7px"} justifyContent={"center"}>
            <Image w={["100px", "200px", "400px"]} src={sourceGraphic} />
          </Flex>
        </Box>
        <Box
          w={["260px", "380px", "400px"]}
          h={"500px"}
          bg={"#F6F6F6"}
          marginY={"auto"}
          boxShadow="0px 0px 10px black"
        >
          <Flex
            display={{ base: "flex", md: "none" }}
            mt={"15px"}
            justifyContent={"center"}
          >
            <Image w={["200px"]} src={sourceLogoBlack} />
          </Flex>
          <Box>{component}</Box>
        </Box>
      </Flex>
    </>
  );
};
