import {
  Flex,
  Stack,
  Text,
  Box,
  Image,
  Avatar,
  Button,
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
  Divider,
} from "@chakra-ui/react";
import { BsCart, BsPerson } from "react-icons/bs";
import logo from "../../assets/public/AM_logo_trans.png";
import { MdSpaceDashboard } from "react-icons/md";
import { MdLogout, MdLogin, MdAppRegistration } from "react-icons/md";
import { LuSearch } from "react-icons/lu";
import { BsChevronDown } from "react-icons/bs";
import { CiLocationOn } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { NavbarMobile } from "./navbarMobile";
import { SearchMobile } from "./searchMobile";

export const Navbar = ({ isNotDisabled = true }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const branches = ["branch 1", "branch 2", "branch 3", "branch 4"];

  const logout = () => {
    localStorage.removeItem('token')
    navigate('/')
  }

  return (
    <>
      {isNotDisabled && (
        <Flex
          alignItems={"center"}
          justifyContent={"space-between"}
          position={'sticky'}
          top={0}
          zIndex={10}
          w={"100%"}
          bgColor={"white"}
        >
          <Flex
            mx={{ base: '10px', md: '30px', lg: '50px' }}
            my={{ base: '20px', lg: 0 }}
            w="100%"
            h="100%"
            justifyContent={"space-between"}
          >
            <NavbarMobile />
            <Image
              display={{ base: "none", lg: "block" }}
              cursor={"pointer"}
              onClick={() => navigate("/")}
              src={logo}
              w={'150px'}
            />
            <Flex
              gap={"2rem"}
              alignItems={"center"}
              display={{ base: 'none', lg: 'flex' }}
              justifyContent={"space-between"}
            >
              <Flex gap="2" alignItems={"center"} justifyContent={"center"}>
                <Icon as={CiLocationOn} color={"black"} w={"5"} h={"5"} />
                <Stack gap={0}>
                  <Text fontSize={{base: 'xs', lg: 'sm'}}>Deliver to</Text>
                  <Text
                    onClick={() => navigate("/")}
                    cursor={"pointer"}
                    fontSize={{base: 'sm', lg: 'md'}}
                    fontWeight={"medium"}
                  >
                    Address
                  </Text>
                </Stack>
              </Flex>
              <Text fontSize={{base: 'sm', lg: 'md'}} cursor={"pointer"} fontWeight={"medium"}>
                Shop
              </Text>
              <Text fontSize={{base: 'sm', lg: 'md'}} cursor={"pointer"} fontWeight={"medium"}>
                Voucher
              </Text>
              <Popover>
                <PopoverTrigger>
                  <Flex gap={3} alignItems={"center"}>
                    <Text fontSize={{base: 'sm', lg: 'md'}} cursor={"pointer"} fontWeight={"medium"}>
                      Branch 1 (useLocation)
                    </Text>
                    <Icon as={BsChevronDown} w={4} h={4} color={"black"} />
                  </Flex>
                </PopoverTrigger>
                <PopoverContent>
                  <PopoverHeader justifyContent={"center"} w="100%">
                    <Text textAlign={'center'} fontWeight={"medium"} fontSize={"lg"}>
                      Select Branch Location
                    </Text>
                  </PopoverHeader>
                  <PopoverBody>
                    {branches.map((item, index) => {
                      return (
                        <>
                        <Text
                          textAlign={'center'}
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
                        {(index + 1) !== branches.length && <Divider size={'xl'} colorScheme="gray"/>}
                        </>
                      );
                    })}
                  </PopoverBody>
                </PopoverContent>
              </Popover>
            </Flex>
            <Flex gap={3} alignItems={"center"}>
              <SearchMobile/>
              <InputGroup display={{ base: 'none', sm: 'block' }}>
                <Input
                  type="search"
                  bgColor={"whiteAlpha.300"}
                  focusBorderColor="gray.300"
                  placeholder="Search products"
                />
                <InputLeftElement>
                  <Icon as={LuSearch} />
                </InputLeftElement>
              </InputGroup>
                  <Button bgColor={'white'} rounded={'full'} cursor={"pointer"}>
                    <Icon
                      as={BsCart}
                      w="5"
                      h="5"
                      color={"black"}
                    />
                  </Button>
                  <Menu alignSelf={'center'}>
                    <MenuButton>
                      <Button bgColor={'white'} rounded={'full'} cursor={"pointer"} >
                        <Icon as={BsPerson} w="5" h="5" color="black"cursor={'pointer'} />
                      </Button>
                    </MenuButton>
                    {token ? (
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
                      <MenuItem onClick={logout} gap="3">
                        <Icon as={MdLogout} w="5" h="5" color="black" />
                        <Text>Logout</Text>
                      </MenuItem>
                    </MenuList>
                    ): (
                        <MenuList>
                            <MenuItem onClick={() => navigate("/login")} gap="3">
                                <Icon as={MdLogin} w="5" h="5" color="black" />
                                <Text>Sign In</Text>
                            </MenuItem>
                            <MenuItem onClick={() => navigate("/register")} gap="3">
                                <Icon as={MdAppRegistration} w="5" h="5" color="black" />
                                <Text>Register</Text>
                            </MenuItem>
                        </MenuList>
                    )}
                  </Menu>
            </Flex>
          </Flex>
        </Flex>
      )}
    </>
  );
};
