import { Flex, Stack, Text, Image, Avatar, Icon, Input, InputGroup, InputLeftElement, Menu, MenuList, MenuItem, MenuButton, MenuDivider } from "@chakra-ui/react";
import { BsCart, BsPerson } from "react-icons/bs";
import { MdSpaceDashboard } from "react-icons/md";
import { TbLogout2 } from "react-icons/tb";
import { LuSearch } from "react-icons/lu";
export const Navbar = ({isNotDisabled = true}) => {
    return (
        <>
        {isNotDisabled && (
            <Flex
            alignItems={'center'}
            justifyContent={'space-around'}
            w={'100vw'}
            h={'80px'}
            bgColor={'blackAlpha.100'}>
                <Image src={'../assets/public/AM_logo_trans.png'} boxSize={'6'} />
                <Flex gap={'1rem'} alignItems={'center'}>
                    <InputGroup>
                    <Input type="search" bgColor={'whiteAlpha.300'} placeholder="Search products"/>
                    <InputLeftElement>
                        <Icon as={LuSearch} />
                    </InputLeftElement>
                    </InputGroup>
                    <Icon as={BsCart} w='4' h='4' color={'black'} cursor={'pointer'} />
                    <Menu p='2'>
                        <Avatar as={MenuButton} size='sm' />
                        <MenuList>
                            <Stack alignItems={'center'} justifyContent={'center'} p='3'>
                                <Avatar size={'lg'} />
                                <Text fontWeight={'bold'}>
                                    Username
                                </Text>
                                <Text>
                                    Email
                                </Text>
                            </Stack>
                            <MenuDivider />
                            <MenuItem gap='3'>
                                <Icon as={BsPerson} w='5' h='5' color='black' />
                                <Text>
                                    Profile
                                </Text>
                            </MenuItem>
                            <MenuItem gap='3'>
                                <Icon as={MdSpaceDashboard} w='5' h='5' color='black' />
                                <Text>
                                    Dashboard
                                </Text>
                            </MenuItem>
                            <MenuItem gap='3'>
                                <Icon as={TbLogout2} w='5' h='5' color='black' />
                                <Text>
                                    Logout
                                </Text>
                            </MenuItem>
                        </MenuList>
                    </Menu>
                </Flex>
            </Flex>
        )}
        </>
    )
}