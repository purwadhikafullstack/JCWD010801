import { MenuItem, Modal, useDisclosure, Icon, Text, ModalOverlay, ModalBody, ModalContent, Stack, Input } from "@chakra-ui/react";
import { useSelector } from "react-redux"
import { FiGift } from "react-icons/fi";
import { BsShare } from "react-icons/bs";

export const ReferralModal = () => {
    const { referralCode } = useSelector((state) => state?.user?.value);
    const { isOpen, onOpen, onClose } = useDisclosure();
    return (
        <>
        <MenuItem onClick={onOpen} gap="3">
            <Icon as={BsShare} w="5" h="5" color="black" />
            <Text>Referral</Text>
        </MenuItem>
        <Modal size={{ base: "xs", md: "lg" }} isOpen={isOpen} onClose={onClose}>
            <ModalOverlay/>
            <ModalContent>
                <ModalBody>
                    <Stack py={8} px={{base: 1, md: 8}} gap={0} alignItems={"center"} textAlign={"center"}>
                        <FiGift size={80} />
                        <Text mt={3} fontWeight={"semibold"} fontSize={{ base: "22px", md: "30px" }}>
                            Share & Earn 50.000 IDR
                        </Text>
                        <Text mt={3} fontWeight={"light"} fontSize={"15px"}>
                            For each friend you refer, you and your friend will earn a 50.000 IDR off coupon.
                        </Text>
                        <Text mt={5} fontSize={"15px"}>
                            YOUR REFERRAL CODE
                        </Text>
                        <Text mt={1} fontWeight={"bold"} fontSize={"20px"}>
                            {referralCode}
                        </Text>
                        <Text mt={1} fontWeight={"light"} fontSize={"15px"}>
                            or share with this link:
                        </Text>
                        <Input
                        mt={4}
                        fontSize={{ base: "12px", md: "15px" }}
                        value={`${process.env.REACT_APP_BASE_URL}register?r=${referralCode}`}
                        borderColor={"gray.300"}
                        focusBorderColor={"inherit"}
                        />
                    </Stack>
                </ModalBody>
            </ModalContent>
        </Modal>
        </>
    )
}