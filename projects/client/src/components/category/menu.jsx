import { Icon, Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react"
import { BiDotsVerticalRounded } from "react-icons/bi";
import { EditCategory } from "./edit";
import { RestoreCategory } from "./restore";
import { DisableCategory } from "./disable";

export const MenuCategory = ({ id, categoryName, categoryImage, isDeleted }) => {
    return (
        <Menu matchWidth={true} alignSelf={"center"}>
            <MenuButton brightness={'100%'} alignItems={'center'} position={'relative'} right={'10px'} rounded={"full"} cursor={"pointer"}>
                <Icon as={BiDotsVerticalRounded} w="10" h="10" color="white" cursor={"pointer"} />
            </MenuButton>
            <MenuList brightness={'100%'}>
                <MenuItem>
                    <EditCategory id={id} categoryName={categoryName} categoryImage={categoryImage} />
                </MenuItem>
                <MenuItem>
                    {isDeleted ? (
                        <RestoreCategory id={id} categoryName={categoryName} />
                    ) : (
                        <DisableCategory id={id} categoryName={categoryName} />
                    )}
                </MenuItem>
            </MenuList>
        </Menu>
    )
}