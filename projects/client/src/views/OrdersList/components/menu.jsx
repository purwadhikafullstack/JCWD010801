import { Menu, MenuButton, Icon, MenuList, MenuItem } from "@chakra-ui/react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { UploadProof } from "./uploadProof";
import { ViewProof } from "./viewProof";

export const MenuOrder = ({ orderId, imgURL, date, branch, amount }) => {
    return (
        <Menu>
            <MenuButton pt={2} justifyContent={"center"} alignItems={'center'} rounded={"full"} cursor={"pointer"}>
                <Icon as={BsThreeDotsVertical} w={6} h={6} color="black" />
            </MenuButton>
            <MenuList>
                <MenuItem>
                    <ViewProof imgURL={imgURL} />
                </MenuItem>
                <MenuItem>
                    <UploadProof id={orderId} date={date} branch={branch} amount={amount} />
                </MenuItem>
            </MenuList>
        </Menu>
    )
}