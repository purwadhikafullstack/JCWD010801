import {
    Flex,
    Stack,
    Text,
    Box,
    Image,
    Avatar,
    Icon,
    Input,
    InputGroup,
    InputLeftElement,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    Menu,
    MenuList,
    MenuItem,
    MenuButton,
    MenuDivider,
} from "@chakra-ui/react";
import { BsCart, BsPerson } from "react-icons/bs";
import logo from "../assets/public/AM_logo_trans.png";
import { MdSpaceDashboard } from "react-icons/md";
import { TbLogout2 } from "react-icons/tb";
import { LuSearch } from "react-icons/lu";
import { BsChevronDown } from "react-icons/bs";
import { CiLocationOn } from "react-icons/ci";
import { useNavigate } from "react-router-dom";

export const Navbar = ({ isNotDisabled = true }) => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const branches = ["branch 1", "branch 2", "branch 3", "branch 4"];

    return (
        <>
            {isNotDisabled && (
                <Flex
                    alignItems={"center"}
                    justifyContent={"space-between"}
                    // position={'sticky'}
                    // top={0}
                    zIndex={10}
                    w={"100%"}
                    bgColor={"blackAlpha.100"}
                >
                    <Flex
                        ml={"5rem"}
                        mr={"5rem"}
                        w="100%"
                        h="100%"
                        justifyContent={"space-between"}
                    >
                        <Flex display={{ base: "none", md: "block" }}>
                            <Image
                                cursor={"pointer"}
                                onClick={() => navigate("/")}
                                src={logo}
                                w={"180px"}
                            />
                        </Flex>
                        <Flex
                            gap={"2rem"}
                            alignItems={"center"}
                            justifyContent={"space-between"}
                        >
                            <Flex gap="2" alignItems={"center"} justifyContent={"center"}>
                                <Icon as={CiLocationOn} color={"black"} w={"5"} h={"5"} />
                                <Stack gap={0}>
                                    <Text fontSize={"sm"}>Deliver to</Text>
                                    <Text
                                        onClick={() => navigate("/")}
                                        cursor={"pointer"}
                                        fontWeight={"bold"}
                                    >
                                        Address
                                    </Text>
                                </Stack>
                            </Flex>
                            <Text cursor={"pointer"} fontWeight={"medium"}>
                                Shop
                            </Text>
                            <Text cursor={"pointer"} fontWeight={"medium"}>
                                Voucher
                            </Text>
                            <Popover>
                                <PopoverTrigger>
                                    <Flex gap={3} alignItems={"center"}>
                                        <Text cursor={"pointer"} fontWeight={"medium"}>
                                            Branch 1 (useLocation)
                                        </Text>
                                        <Icon as={BsChevronDown} w={4} h={4} color={"black"} />
                                    </Flex>
                                </PopoverTrigger>
                                <PopoverContent>
                                    <PopoverHeader justifyContent={"center"} w="100%">
                                        <Text fontWeight={"medium"} fontSize={"lg"}>
                                            Select Branch Location
                                        </Text>
                                    </PopoverHeader>
                                    <PopoverBody>
                                        {branches.map((item, index) => {
                                            return (
                                                <Text
                                                    as={Box}
                                                    key={index}
                                                    role={"group"}
                                                    borderRadius={"md"}
                                                    p={2}
                                                    fontWeight={400}
                                                    color={"gray.500"}
                                                    _hover={{
                                                        bgColor: "blackAlpha.100",
                                                        color: "black",
                                                        fontWeight: 500,
                                                    }}
                                                >
                                                    {item}
                                                </Text>
                                            );
                                        })}
                                    </PopoverBody>
                                </PopoverContent>
                            </Popover>
                        </Flex>
                        <Flex gap={"2rem"} alignItems={"center"}>
                            <InputGroup>
                                <Input
                                    type="search"
                                    bgColor={"whiteAlpha.300"}
                                    placeholder="Search products"
                                />
                                <InputLeftElement>
                                    <Icon as={LuSearch} />
                                </InputLeftElement>
                            </InputGroup>
                            {token ? (
                                <>
                                    <Icon
                                        as={BsCart}
                                        w="5"
                                        h="5"
                                        color={"black"}
                                        cursor={"pointer"}
                                    />
                                    <Menu p="2">
                                        <Avatar as={MenuButton} size="sm" />
                                        <MenuList>
                                            <Stack
                                                alignItems={"center"}
                                                justifyContent={"center"}
                                                p="3"
                                            >
                                                <Avatar size={"lg"} />
                                                <Text fontWeight={"bold"}>Username</Text>
                                                <Text>Email</Text>
                                            </Stack>
                                            <MenuDivider />
                                            <MenuItem onClick={() => navigate("/")} gap="3">
                                                <Icon as={MdSpaceDashboard} w="5" h="5" color="black" />
                                                <Text>Dashboard</Text>
                                            </MenuItem>
                                            <MenuItem onClick={() => navigate("/")} gap="3">
                                                <Icon as={BsPerson} w="5" h="5" color="black" />
                                                <Text>Profile</Text>
                                            </MenuItem>
                                            <MenuItem onClick={() => navigate("/")} gap="3">
                                                <Icon as={TbLogout2} w="5" h="5" color="black" />
                                                <Text>Logout</Text>
                                            </MenuItem>
                                        </MenuList>
                                    </Menu>
                                </>
                            ) : (
                                <>
                                    <Text
                                        onClick={() => navigate("/login")}
                                        cursor={"pointer"}
                                        fontWeight={"medium"}
                                    >
                                        Sign in
                                    </Text>
                                    <Text cursor={"pointer"} fontWeight={"medium"}>
                                        Register
                                    </Text>
                                </>
                            )}
                        </Flex>
                    </Flex>
                </Flex>
            )}
        </>
    );
};