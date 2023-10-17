import Axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { useState, useRef } from "react";
import {
	Box,
	Button,
	Flex,
	FormControl,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	useDisclosure,
} from "@chakra-ui/react";
import { MdOutlineRateReview } from "react-icons/md";
import { AiOutlineStar, AiTwotoneStar } from "react-icons/ai";

export default function ReviewModal({ id, quantity, invoice }) {
	const token = localStorage.getItem("token");
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [rating, setRating] = useState(0);
	const commentRef = useRef();

	const handleRatingClick = (value) => {
		setRating(value);
	};

	return (
		<>
			<Button onClick={onOpen} ml={"15px"} mt={"4px"} size={"xs"} colorScheme="teal" borderRadius={"20px"} w={"90px"}>
				<Box mt={"1px"} mr={"5px"}>
					<MdOutlineRateReview />
				</Box>
				Review
			</Button>

			<Modal isCentered isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader fontWeight={""}>Product's rating & review</ModalHeader>
					<ModalCloseButton />
					<ModalBody pb={6}>
						<Flex>
							{[1, 2, 3, 4, 5].map((value) => (
								<Button
									size={"xs"}
									key={value}
									colorScheme={value <= rating ? "white" : "white"}
									onClick={() => handleRatingClick(value)}
								>
									{value <= rating ? (
										<AiTwotoneStar fontWeight={"light"} size={"40"} color="yellow" />
									) : (
										<AiOutlineStar fontWeight={"light"} size={"40"} color="gray" />
									)}
								</Button>
							))}
						</Flex>
						<FormControl mt={4}>
							<Input
								focusBorderColor="grey"
								borderBottom={"2px solid black"}
								variant={"flushed"}
								placeholder="Drop your review here"
								ref={commentRef}
							/>
						</FormControl>
						<Flex mt={"5px"} justifyContent={"space-between"}>
							<Flex fontSize={"13px"} fontWeight={"light"}>
								Quantity: {quantity} item(s)
							</Flex>
							<Flex fontSize={"13px"} fontWeight={"light"}>
								Invoice: {invoice}
							</Flex>
						</Flex>
					</ModalBody>

					<ModalFooter>
						<Button
							bg="teal"
							color={"white"}
							onClick={async () => {
								if (rating === 0) {
									toast.error("Please provide a rating", {
										position: "top-center",
										autoClose: 4000,
										hideProgressBar: false,
										closeOnClick: true,
										pauseOnHover: true,
										draggable: true,
										progress: undefined,
										theme: "dark",
									});
								} else {
									try {
										await Axios.post(
											`${process.env.REACT_APP_API_BASE_URL}/product/review/${id}`,
											{
												rating,
												comment: commentRef.current.value,
												qty: quantity,
												invoiceNumber: invoice,
											},
											{
												headers: { Authorization: `Bearer ${token}` },
											}
										);
										toast.success("Product Reviewed", {
											position: "top-center",
											autoClose: 4000,
											hideProgressBar: false,
											closeOnClick: true,
											pauseOnHover: true,
											draggable: true,
											progress: undefined,
											theme: "dark",
										});
										onClose();
									} catch (error) {
										toast.error(error.response.data.message, {
											position: "top-center",
											autoClose: 4000,
											hideProgressBar: false,
											closeOnClick: true,
											pauseOnHover: true,
											draggable: true,
											progress: undefined,
											theme: "dark",
										});
									}
								}
							}}
						>
							Send
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
}
