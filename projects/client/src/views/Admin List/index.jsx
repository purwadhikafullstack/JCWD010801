import Axios from "axios";
import { Avatar, Box, Flex, Text } from "@chakra-ui/react"
import { useEffect, useState } from "react";
import AddAdmin from "./components/addAdmin";

export const AdminListPage = () => {
    const [data, setData] = useState();
    const getEmployee = async (data) => {
        try {
            const response = await Axios.get(`${process.env.REACT_APP_API_BASE_URL}/admin/alladmins`, data);
            setData(response.data);
            console.log(response);
        } catch (error) {
            console.log(error);
        };
    };
    useEffect(() => {
        getEmployee();
    }, []);
    return (
        <>
            <Box w={"full"} bg={"white"}>
                <Flex mx={"80px"} mt={"30px"} justifyContent={"space-between"}>
                    <Box >
                        <Text fontSize={"30px"} fontWeight={"bold"}>Admins (Bandung)</Text>
                        <Text fontWeight={"light"}>All the admins of this branch are listed here</Text>
                    </Box>
                    <AddAdmin/>
                </Flex>
                <Flex mt={"20px"} maxW={"1400px"} flexWrap={"wrap"} justifyContent={"center"}>
                    {data?.map((item) => {
                        return (
                            <>
                                <Box w={"220px"} h={"160px"} ml={"25px"} bg={"#f7f7f9"} borderRadius={"8px"}>
                                    <Flex pt={"10px"} pl={"20px"}>
                                        <Avatar />
                                        <Box mt={"5px"}>
                                            <Text ml={"10px"} fontWeight={"bold"}>{item.firstName} {item.lastName}</Text>
                                            <Text ml={"10px"} fontWeight={"light"} fontSize={"12px"}>{item.username}</Text>
                                        </Box>
                                    </Flex>
                                    <Flex mt={"15px"} justifyContent={"center"}>
                                        <Text w={"80px"} h={"25px"} bg={"green.100"} color={"green"}
                                            borderRadius={"5px"} lineHeight={"25px"} textAlign={"center"}>Admin</Text>
                                        <Text ml={"10px"} w={"90px"} h={"25px"} bg={"green.100"} color={"green"}
                                            borderRadius={"5px"} lineHeight={"25px"} textAlign={"center"}>{item.Branch?.name}</Text>
                                    </Flex>
                                    <Flex mt={"15px"} ml={"8px"}>
                                        <Text ml={"10px"} fontSize={"12px"} fontWeight={"bold"}>Email:</Text>
                                        <Text fontWeight={"light"} fontSize={"12px"}> ‎ {item.email}</Text>
                                    </Flex>
                                    <Flex ml={"8px"}>
                                        <Text ml={"10px"} fontSize={"12px"} fontWeight={"bold"}>Phone:</Text>
                                        <Text fontWeight={"light"} fontSize={"12px"}> ‎ {item.phone}</Text>
                                    </Flex>
                                </Box>
                            </>
                        );
                    })}
                </Flex>
            </Box>
        </>
    )
}