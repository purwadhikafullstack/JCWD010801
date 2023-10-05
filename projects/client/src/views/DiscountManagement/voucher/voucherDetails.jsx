import {
	Text,
	Icon,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Stack,
	useDisclosure,
	Button,
    Flex
} from "@chakra-ui/react";

export const VoucherManagementDetails = ({ name, minimumPayment, maximumDiscount, code, type, Product, BranchId, amountPerRedeem, nominal, isPercentage, availableFrom, validUntil }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    return (
        <>
        <Text onClick={onOpen} fontWeight={"semibold"} cursor={"pointer"}>View Details</Text>
        <Modal size={{ base: "sm", sm: "md", md: "lg" }} isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent size={{ base: "sm", sm: "md", md: "lg" }} borderRadius={"10px"}>
                <ModalHeader borderTopRadius={"10px"} color={"white"} bg={"#373433"}>
                    {name}
                </ModalHeader>
                <ModalCloseButton color={"white"} />
                <ModalBody p={5}>
                    <Stack>
                        <Flex justifyContent={"space-between"}>
                            <Stack gap={2}>
                                <Stack>
                                    <Text fontWeight={"semibold"}>Discount Code</Text>
                                    <Text>{code}</Text>
                                </Stack>
                                <Stack>
                                    <Text fontWeight={"semibold"}>Discount Type</Text>
                                    <Text>{type}</Text>
                                </Stack>
                                <Stack>
                                    <Text fontWeight={"semibold"}>Minimum Transaction</Text>
                                    <Text>{minimumPayment ? `Rp. ${minimumPayment.toLocaleString("id-ID")}` : '-'}</Text>
                                </Stack>
                                <Stack>
                                    <Text fontWeight={"semibold"}>Available From</Text>
                                    <Text>
                                        {new Date(availableFrom).toLocaleString("en-EN", {
                                            timeStyle: "medium",
                                            dateStyle: "long"
                                        })} 
                                    </Text>
                                </Stack>
                            </Stack>

                            <Stack gap={2}>
                                <Stack>
                                    <Text fontWeight={"semibold"}>Branch</Text>
                                    <Text>{BranchId}</Text>
                                </Stack>
                                <Stack>
                                    <Text fontWeight={"semibold"}>Nominal</Text>
                                    <Text>{isPercentage ? `${nominal}% up to Rp. ${maximumDiscount.toLocaleString("id-ID")}` : `Rp. ${nominal.toLocaleString("id-ID")}`}</Text>
                                </Stack>
                                <Stack>
                                    <Text fontWeight={"semibold"}>Amount Per Redeem</Text>
                                    <Text>{`${amountPerRedeem} vouchers`}</Text>
                                </Stack>
                                <Stack>
                                    <Text fontWeight={"semibold"}>Expiry Date</Text>
                                    <Text>
                                        {new Date(validUntil).toLocaleString("en-EN", {
                                            timeStyle: "medium",
                                            dateStyle: "long"
                                        })} 
                                    </Text>
                                </Stack>
                            </Stack>
                        </Flex>
                    </Stack>
                </ModalBody>
            </ModalContent>
        </Modal>
        </>
    )
}