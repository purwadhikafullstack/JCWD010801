import {
	Flex,
	Text,
	Icon,
	useDisclosure,
	Drawer,
	DrawerOverlay,
	DrawerContent,
	DrawerHeader,
	Stack,
	Heading,
} from "@chakra-ui/react";
import { TbDiscount2 } from "react-icons/tb";
import { MdKeyboardArrowRight } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { VoucherList } from "./list";
import { FiArrowLeft } from "react-icons/fi";
import { RxCrossCircled } from "react-icons/rx";
import { RedeemCode } from "./redeemCode";
import { setVoucherInfo } from "../../../redux/voucherSlice";

export const SelectVoucher = ({ subtotal, checkRequirements, items }) => {
	const voucher = useSelector((state) => state?.voucher?.value);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const dispatch = useDispatch();

	const removeVoucher = () => {
		onClose();
		dispatch(setVoucherInfo({}));
	};

	// const checkMissingRequirementType = () => {
	// 	if (voucher.minPay && voucher.minPay > subtotal)
	// 		return `Minimum subtotal: Rp. ${voucher.minPay?.toLocaleString("id-ID")} `;
	// 	else if (voucher.type === "Single item") {
	// 		let booleanCheck = false;
	// 		items?.map(({ ProductId }) => {
	// 			if (ProductId === voucher.ProductId) {
	// 				booleanCheck = true;
	// 			}
	// 		});
	// 		if (!booleanCheck)
	// 			return `You need to have ${voucher.Product.productName} in your cart in order to use this voucher`;
	// 	}
	// 	return;
	// };
	//! FAIL BUILD!
	// Array.prototype.map() expects a return value from arrow function array-callback-return

	const checkMissingRequirementType = () => {
		if (voucher?.minPay && voucher?.minPay > subtotal) {
			return `Minimum subtotal: Rp. ${voucher?.minPay?.toLocaleString("id-ID")}`;
		} else if (voucher?.type === "Single item") {
			let booleanCheck = false;
			items?.map(({ ProductId }) => {
				if (ProductId === voucher?.ProductId) {
					booleanCheck = true;
				}
				return null;
			});
			if (!booleanCheck) {
				return `You need to have ${voucher?.Product?.productName} in your cart in order to use this voucher`;
			}
		}
		return null;
	};

	return (
		<>
			<Flex
				onClick={onOpen}
				border={"2px solid lightgray"}
				borderColor={checkRequirements ? "red.500" : "lightgray"}
				cursor={"pointer"}
				borderRadius={"10px"}
				p={1}
				w={"100%"}
				justifyContent={"space-between"}
				alignItems={"center"}
			>
				<Flex ml={2} gap={3} alignItems={"center"}>
					<Icon as={TbDiscount2} w="7" h="7" color={"black"} />
					<Stack gap={0} h={"100%"} justifyContent={"center"}>
						<Text fontWeight={"medium"}>{voucher.name ? voucher.name : "Save more using promos"}</Text>
						{/* {voucher.minPay && ( */}
						<Text fontWeight={"light"} fontSize={"sm"}>
							{checkMissingRequirementType()}
						</Text>
						{/* )} */}
					</Stack>
				</Flex>
				<Flex justifyContent={"center"} alignItems={"center"} p={2} borderLeft={"2px solid lightgray"}>
					<Icon
						_hover={{ color: "red.400" }}
						zIndex={10}
						onClick={voucher?.name ? removeVoucher : null}
						as={voucher?.name ? RxCrossCircled : MdKeyboardArrowRight}
						w="8"
						h="8"
						color={checkRequirements ? "red.600" : "lightgray"}
					/>
				</Flex>
			</Flex>
			<Drawer placement="bottom" isOpen={isOpen} onClose={onClose}>
				<DrawerOverlay>
					<DrawerContent w={"100vw"} h={"100vh"} overflowY={"auto"} alignItems={"center"} p={{ base: 1, md: 4 }}>
						<DrawerHeader alignSelf={"start"}>
							<Flex gap={5} mb={5} alignItems={"center"}>
								<Icon cursor={"pointer"} w={10} h={10} as={FiArrowLeft} onClick={onClose} />
								<Heading fontWeight={"semibold"}>My Vouchers</Heading>
							</Flex>
						</DrawerHeader>
						<Stack w={"90%"} gap={3}>
							<Text fontWeight={"semibold"} fontSize={"md"}>
								Enter Promo Code
							</Text>
							<RedeemCode />
							<VoucherList />
						</Stack>
					</DrawerContent>
				</DrawerOverlay>
			</Drawer>
		</>
	);
};
