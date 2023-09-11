import { Box, Center, VStack, Heading } from "@chakra-ui/react";
import EditFirstNameField from "./profileField/firstNameField";
import EditLastNameField from "./profileField/lastNameField";
import EditGenderField from "./profileField/genderField";
import EditBirthDateField from "./profileField/birthDateField";
import EditPhoneField from "./profileField/phoneField";
import EditEmailField from "./profileField/emailField";
import EditAvatar from "./avatar";
import ChangePasswordModal from "./profileField/changePassword";
import { useSelector } from "react-redux";

const ProfileTab = () => {
	const data = useSelector((state) => state.user.value);

	return (
		<Center>
			<Box bg="white" p={4} boxShadow="lg" borderRadius="lg" w={{ md: "80%", base: "100%" }} maxW="600px">
				<Center>
					<EditAvatar/>
				</Center>
				<Heading size="lg" textAlign="center" color="#4A4A4A" mt={4}>
					{data?.username}
				</Heading>

				<VStack spacing={4} alignItems="stretch" mt={6}>
					<SectionHeading>Your Bio</SectionHeading>
					<EditFirstNameField />
					<EditLastNameField />
					<EditGenderField />
					<EditBirthDateField />
				</VStack>
				<VStack spacing={4} alignItems="stretch" mt={6}>
					<SectionHeading>Your Contact</SectionHeading>
					<EditPhoneField />
					<EditEmailField />
				</VStack>
				<VStack spacing={4} mt={6} alignItems="stretch">
					<ChangePasswordModal/>
				</VStack>
			</Box>
		</Center>
	);
};

const SectionHeading = ({ children }) => {
	return (
		<Heading size="sm" color="#4A4A4A" fontWeight="bold">
			{children}
		</Heading>
	);
};

export default ProfileTab;
