import {
	Drawer,
	DrawerBody,
	DrawerContent,
	DrawerOverlay,
	Flex,
	Icon,
	Stack,
	Text,
	useDisclosure,
} from "@chakra-ui/react";
import { ButtonTemp } from "../../../components/button";
import { MdKeyboardArrowUp } from "react-icons/md";
import { Receipt } from "./receipt";
import { useNavigate } from "react-router-dom";
import { SelectVoucher } from "../../Voucher/components/selectVoucher";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

export const ReceiptMobile = ({ subtotal, items }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const voucher = useSelector((state) => state?.voucher?.value);
	const navigate = useNavigate();
	const [discount, setDiscount] = useState(0);

	const checkVoucherRequirements = () => {
		if (voucher.minPay && voucher.minPay > subtotal) return setDiscount(0);
		if (voucher.isPercentage) {
			if ((subtotal * voucher.nominal) / 100 > voucher.maxDisc) return setDiscount(voucher.maxDisc);
			else return setDiscount((subtotal * voucher.nominal) / 100);
		} else setDiscount(voucher.nominal);
	};

	const tax = voucher.VoucherId ? (subtotal - discount) / 10 : subtotal / 10;
	const total = voucher.VoucherId ? tax + (subtotal - discount) : tax + subtotal;

	const checkDisableCheckout = () => {
		if (voucher.minPay && voucher.minPay > subtotal) return true;
		if (voucher.type === "Single item") {
			let booleanCheck = true;
			items?.forEach(({ ProductId }) => {
				if (ProductId === voucher?.Product?.id) {
					booleanCheck = false;
				}
			});
			return booleanCheck;
		}
		return false;
	};

	useEffect(() => {
		checkVoucherRequirements();
		// eslint-disable-next-line
	}, [ voucher, items ])

	return (
		<>
			<Stack
				w="100%"
				display={subtotal === 0 ? "none" : { base: "flex", md: "none" }}
				flexDir={"column"}
				position={"fixed"}
				bgColor={"white"}
				bottom={0}
				p={3}
				pt={5}
				zIndex={10}
			>
				<SelectVoucher items={items} subtotal={subtotal} checkRequirements={checkDisableCheckout()} />
				<Flex w="100%" p={2} alignItems={"center"}>
					<Stack onClick={onOpen} gap={0} w="50%">
						<Text fontSize={"sm"}>Estimated Total</Text>
						<Flex alignItems={"center"} gap={2}>
							<Text fontSize={"xl"} fontWeight={"semibold"}>
								{`Rp. ${total?.toLocaleString("id-ID")}`}
							</Text>
							<Icon as={MdKeyboardArrowUp} w="5" h="5" />
						</Flex>
					</Stack>
					<ButtonTemp
						isDisabled={checkDisableCheckout()}
						onClick={() => navigate("/checkout")}
						w={"50%"}
						content={"CHECK OUT"}
					/>
				</Flex>
			</Stack>
			<Drawer placement="bottom" isOpen={isOpen} onClose={onClose}>
				<DrawerOverlay />
				<DrawerContent borderTopRadius={"30px"}>
					<DrawerBody>
						<Flex pt={2} justifyContent={"center"} w={"100%"}>
							<Flex onClick={onClose} rounded={"full"} w={"20%"} h={"5px"} bgColor={"gray.300"} color={"gray.300"}>
								.
							</Flex>
						</Flex>
						<Receipt subtotal={subtotal} promo={false} />
					</DrawerBody>
				</DrawerContent>
			</Drawer>
		</>
	);
};
