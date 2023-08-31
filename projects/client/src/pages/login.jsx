import source from "../assets/public/AM_bg_login.png"
import sourceLogo from "../assets/public/AM_logo_white.png"
import sourceLogoBlack from "../assets/public/AM_logo_trans.png"
import sourceGraphic from "../assets/public/AM_graphic.png"
import { Link } from "react-router-dom"
import { UserLogin } from "../views/Login/components/userLogin";
import { Box, Flex, Heading, Image, Text } from "@chakra-ui/react";
import { Tabs, TabPanels, TabPanel } from '@chakra-ui/react'
// import { BsFillPersonFill, BsFillPersonPlusFill } from 'react-icons/bs';

export const Login = () => {
    return (
        <>
            <Image w={"full"} h={"100vh"} src={source} position={"absolute"} />
            <Flex h={"100vh"} justifyContent={"center"} position={"relative"} >
                <Box display={{ base: "none", md: "block", lg: "block" }}
                    w={["200px", "300px", "400px"]} h={["500px"]}
                    bg={"#373433"} marginY={"auto"} boxShadow='0px 0px 10px black'>
                    <Flex mt={"50px"} justifyContent={"center"}>
                        <Image w={["100px", "200px", "300px"]} src={sourceLogo} />
                    </Flex>
                    <Flex mt={"56.7px"} justifyContent={"center"}>
                        <Image w={["100px", "200px", "400px"]} src={sourceGraphic} />
                    </Flex>
                </Box>
                <Box w={["260px", "380px", "400px"]} h={"500px"}
                    bg={"#F6F6F6"} marginY={"auto"} boxShadow='0px 0px 10px black'>
                    <Flex display={{ base: "flex", md: "none" }} mt={"25px"} justifyContent={"center"}>
                        <Image w={["200px"]} src={sourceLogoBlack} />
                    </Flex>
                    <Box mt={["45px", "40px", "150px"]} >
                        <Heading ml={"50px"} mt={"20px"}
                            fontSize={"30px"} fontFamily={"monospace"}>Shop Now.</Heading>
                        <Tabs mt={"10px"} align="center" variant='unstyled'>
                            <TabPanels>
                                <TabPanel >
                                    <UserLogin />
                                </TabPanel>
                                <TabPanel>
                                    <UserLogin />
                                </TabPanel>
                            </TabPanels>
                            {/* <TabList>
                                <Tab><BsFillPersonFill mt={"2px"} size={30} /></Tab>
                                <Tab><BsFillPersonPlusFill mt={"2px"} size={30} /></Tab>
                            </TabList> */}
                        </Tabs>
                    </Box>
                    <Flex mt={["60px", "70px", "100px"]} fontSize={"12px"} justifyContent={"center"} >
                        <Text>Don't have an account? ‎</Text>
                        <Text as={Link} to="/" color={"gray"}>Click Here</Text>
                    </Flex>
                </Box>
            </Flex>
        </>
    );
}