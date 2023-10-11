import { Menu, MenuButton, Icon, MenuList, MenuItem } from "@chakra-ui/react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { UploadProof } from "./uploadProof";
import { ViewProof } from "./viewProof";
import { CancelOrder } from "./cancel";
import { ConfirmOrder } from "./confirm";
import { useEffect } from "react";

export const MenuOrder = ({ reload, setReload, orderId, imgURL, date, branch, amount, status, invoice }) => {
	useEffect(() => {
		setReload(true);
	}, [reload]);
	return (
		<Menu>
			<MenuButton pt={2} justifyContent={"center"} alignItems={"center"} rounded={"full"} cursor={"pointer"}>
				<Icon as={BsThreeDotsVertical} w={6} h={6} color="black" />
			</MenuButton>
			<MenuList>
				{imgURL && (
					<MenuItem>
						<ViewProof reload={reload} setReload={setReload} imgURL={imgURL} />
					</MenuItem>
				)}
				{status === "Waiting payment" && (
					<MenuItem>
						<UploadProof
							invoice={invoice}
							reload={reload}
							setReload={setReload}
							id={orderId}
							date={date}
							branch={branch}
							amount={amount}
						/>
					</MenuItem>
				)}
				{status === "Waiting payment" && (
					<MenuItem>
						<CancelOrder reload={reload} setReload={setReload} id={orderId} />
					</MenuItem>
				)}
				{status === "Sent" && (
					<MenuItem>
						<ConfirmOrder invoice={invoice} reload={reload} setReload={setReload} id={orderId} />
					</MenuItem>
				)}
			</MenuList>
		</Menu>
	);
};
