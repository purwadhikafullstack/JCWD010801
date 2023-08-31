import source from "../assets/public/AM_bg_login.png"
import sourceLogo from "../assets/public/AM_logo_white.png"
import sourceLogoBlack from "../assets/public/AM_logo_trans.png"
import sourceGraphic from "../assets/public/AM_graphic.png"
import { Link } from "react-router-dom"
import { UserLogin } from "../views/Login/components/userLogin";
import { AdminLogin } from "../views/Login/components/adminLogin"
import { Box, Flex, Image, TabIndicator, Text } from "@chakra-ui/react";
import { Tab, Tabs, TabPanels, TabPanel, TabList } from '@chakra-ui/react'
import { BsFillPersonFill, BsFillPersonPlusFill } from 'react-icons/bs';

export const Login = () => {
    // const token = localStorage.getItem("token");
    // useEffect(() => {
    //     // if (token) {
    //     //     navigate("/");
    //     // }
    // }, []);
    return (
        <>
            <Image w={"full"} h={"100vh"} src={source} position={"absolute"} />
            <Flex h={"100vh"} justifyContent={"center"} position={"relative"} >
                <Box display={{ base: "none", md: "block", lg: "block" }}
                    w={["200px", "300px", "400px"]} h={["500px"]}
                    bg={"#373433"} marginY={"auto"} boxShadow='0px 0px 10px black'>
                    <Flex mt={"50px"} justifyContent={"center"}>
                        <Image w={["100px", "200px", "300px"]} src={sourceLogo}
                            transition="transform 0.3s ease-in-out" _hover={{ transform: "scale(1.1)" }} />
                    </Flex>
                    <Flex mt={"56.7px"} justifyContent={"center"}>
                        <Image w={["100px", "200px", "400px"]} src={sourceGraphic} />
                    </Flex>
                </Box>
                <Box w={["260px", "380px", "400px"]} h={"500px"}
                    bg={"#F6F6F6"} marginY={"auto"} boxShadow='0px 0px 10px black'>
                    <Flex display={{ base: "flex", md: "none" }} mt={"15px"} justifyContent={"center"}>
                        <Image w={["200px"]} src={sourceLogoBlack} />
                    </Flex>
                    <Box>
                        <Tabs mt={"10px"} align="center" variant='unstyled'>
                            <TabPanels>
                                <TabPanel >
                                    <UserLogin />
                                </TabPanel>
                                <TabPanel>
                                    <AdminLogin />
                                </TabPanel>
                            </TabPanels>
                            <TabList mt={"15px"}>
                                <Tab ><BsFillPersonFill mt={"2px"} size={[22]} />
                                    <Text>‎ User
                                    </Text>
                                </Tab>
                                <Tab><BsFillPersonPlusFill mt={"2px"} size={22} />
                                    <Text>‎ Admin </Text>
                                </Tab>
                            </TabList>
                            <TabIndicator mt="-1.5px" height="2px" bg="#373433" borderRadius="1px" />
                        </Tabs>
                    </Box>
                    <Flex mt={["30px", "35px", "45px"]} fontSize={"12px"} justifyContent={"center"} >
                        <Text>Don't have an account? ‎</Text>
                        <Text as={Link} to="/" color={"gray"}
                            transition="transform 0.3s ease-in-out" _hover={{ transform: "scale(1.1)" }} >Click Here</Text>
                    </Flex>
                </Box>
            </Flex>
        </>
    );
}