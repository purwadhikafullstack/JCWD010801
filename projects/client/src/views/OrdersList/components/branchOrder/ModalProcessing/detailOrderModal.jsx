import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	Button,
	useDisclosure,
	Box,
	Flex,
	Text,
	Badge,
	Image,
} from "@chakra-ui/react";
import { AiOutlineFileSearch } from "react-icons/ai";

export const DetailProcessModal = ({
	etd,
	status,
	created,
	paymentProof,
	shipment,
	shipmentMethod,
	subtotal,
	discount,
	tax,
	total,
	label,
	address,
	city,
	province,
	subdistrict,
	postal_code,
}) => {
	const hasImage = !!paymentProof;
	const { isOpen, onOpen, onClose } = useDisclosure();
	const formatRupiah = (number) => {
		const formatter = new Intl.NumberFormat("id-ID", {
			style: "currency",
			currency: "IDR",
			minimumFractionDigits: 0,
		});

		let formatted = formatter.format(number);
		formatted = formatted.replace("Rp", "Rp.");
		return formatted;
	};
	return (
		<>
			<Button
				my={"auto"}
				mr={"5px"}
				backgroundColor={"blue.900"}
				color={"white"}
				_hover={{
					textColor: "white",
					bg: "blue.600",
					_before: {
						bg: "inherit",
					},
					_after: {
						bg: "inherit",
					},
				}}
				onClick={onOpen}
			>
				<AiOutlineFileSearch color="white" size={20} />‎ Detail order
			</Button>

			<Modal onClose={onClose} isOpen={isOpen} isCentered>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader bg={"black"} color={"white"}>
						Detail Order
					</ModalHeader>
					<ModalCloseButton color={"white"} />
					<ModalBody>
						<Box>
							<Flex>
								{hasImage && (
									<Image
										w={"90px"}
										src={`${process.env.REACT_APP_BASE_URL}/orders/${paymentProof}`}
										alt={"Payment Proof"}
									/>
								)}
								{!hasImage && (
									<Flex direction={"column"} w={"90px"} justifyContent={"center"}>
										<Text textAlign={"center"} fontSize={"10px"} w={"90px"}>
											No payment proof
										</Text>
									</Flex>
								)}
								<Flex direction={"column"} justify={"center"}>
									<Text color={"balck"}>
										{status === "Sent" || status === "Received" ? (
											<Badge ml={"10px"} mt={"2px"} colorScheme="green">
												{status}
											</Badge>
										) : status === "Waiting for payment" || status === "Pending payment confirmation" ? (
											<Badge ml={"10px"} mt={"2px"} colorScheme="yellow">
												{status}
											</Badge>
										) : status === "Processing" ? (
											<Badge ml={"10px"} mt={"2px"} colorScheme="blue">
												{status}
											</Badge>
										) : (
											<Badge ml={"10px"} mt={"2px"} colorScheme="red">
												{status}
											</Badge>
										)}
									</Text>
								</Flex>
							</Flex>
							<Flex mt={"5px"} justifyContent={"space-between"}>
								<Text fontWeight={"semibold"}>Checkout date & time</Text>
								<Text fontFamily={"serif"} mt={"3px"} fontSize={"13px"} color={"balck"}>
									{new Date(`${created}`)
										.toLocaleDateString("us-us", {
											year: "numeric",
											month: "long",
											day: "numeric",
											hour: "numeric",
											minute: "numeric",
											second: "numeric",
											hour12: false,
										})
										.replace("at", "|")}
								</Text>
							</Flex>
							<Flex mt={"5px"} justifyContent={"space-between"}>
								<Text fontWeight={"semibold"}>Subtotal</Text>
								<Text fontFamily={"serif"} fontSize={"15px"} color={"balck"}>
									{formatRupiah(subtotal)}
								</Text>
							</Flex>
							<Flex mt={"5px"} justifyContent={"space-between"}>
								<Text fontWeight={"semibold"}>Discount</Text>
								<Text fontFamily={"serif"} fontSize={"15px"} color={"balck"}>
									{discount} %
								</Text>
							</Flex>
							<Flex mt={"5px"} justifyContent={"space-between"}>
								<Text fontWeight={"semibold"}>Tax</Text>
								<Text fontFamily={"serif"} fontSize={"15px"} color={"balck"}>
									{formatRupiah(tax)}
								</Text>
							</Flex>
							<Flex mt={"5px"} justifyContent={"space-between"}>
								<Text fontWeight={"semibold"}>Total</Text>
								<Text fontFamily={"serif"} fontWeight={"bold"} fontSize={"15px"} color={"balck"}>
									{formatRupiah(total)}
								</Text>
							</Flex>
							<Box>
								<Flex justifyContent={"center"} fontWeight={"bold"}>
									Address & Shipment
								</Flex>
								<Flex mt={"5px"} justifyContent={"space-between"}>
									<Text fontWeight={"semibold"}>Label</Text>
									<Text fontFamily={"serif"} fontSize={"15px"} color={"balck"}>
										{label}
									</Text>
								</Flex>
								<Flex mt={"5px"} justifyContent={"space-between"}>
									<Text fontWeight={"semibold"}>Address</Text>
									<Text fontFamily={"serif"} fontSize={"15px"} color={"balck"}>
										{address}
									</Text>
								</Flex>
								<Flex mt={"5px"} justifyContent={"space-between"}>
									<Text fontWeight={"semibold"}>Subdistrict</Text>
									<Text fontFamily={"serif"} fontSize={"15px"} color={"balck"}>
										{subdistrict}
									</Text>
								</Flex>
								<Flex mt={"5px"} justifyContent={"space-between"}>
									<Text fontWeight={"semibold"}>City</Text>
									<Text fontFamily={"serif"} fontSize={"15px"} color={"balck"}>
										{city}
									</Text>
								</Flex>
								<Flex mt={"5px"} justifyContent={"space-between"}>
									<Text fontWeight={"semibold"}>Province</Text>
									<Text fontFamily={"serif"} fontSize={"15px"} color={"balck"}>
										{province}
									</Text>
								</Flex>
								<Flex mt={"5px"} justifyContent={"space-between"}>
									<Text fontWeight={"semibold"}>Postal code</Text>
									<Text fontFamily={"serif"} fontSize={"15px"} color={"balck"}>
										{postal_code}
									</Text>
								</Flex>
								<Flex mt={"5px"} justifyContent={"space-between"}>
									<Text fontWeight={"semibold"}>Shipment service</Text>
									<Text fontFamily={"serif"} fontSize={"15px"} color={"balck"}>
										{shipment}
									</Text>
								</Flex>
								<Flex mt={"5px"} justifyContent={"space-between"}>
									<Text fontWeight={"semibold"}>Estimate time</Text>
									<Text fontFamily={"serif"} fontSize={"15px"} color={"balck"}>
										{etd}
									</Text>
								</Flex>
								<Flex mt={"5px"} justifyContent={"space-between"}>
									<Text fontWeight={"semibold"}>Shipment method</Text>
									<Text fontFamily={"serif"} fontSize={"15px"} color={"balck"}>
										{shipmentMethod}
									</Text>
								</Flex>
							</Box>
						</Box>
					</ModalBody>
					<ModalFooter>
						<Button onClick={onClose}>Close</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};
