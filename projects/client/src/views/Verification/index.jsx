import { Button, Center, Image, Text, Heading, VStack } from "@chakra-ui/react";
import Axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import source from "../../assets/public/AM_logo_trans.png";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export const VerificationPageView = () => {
	const { token } = useParams();
	const navigate = useNavigate();
	const headers = {
		Authorization: `Bearer ${token}`,
	};

  const handleSubmit = async () => {
    try {
      const response = await Axios.patch(
        `${process.env.REACT_APP_API_BASE_URL}/user/verification`,
        {},
        { headers }
      );
      navigate("/login");
      toast.success(response.data.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
    });
    } catch (error) {
        toast.error(error?.response.data.error.message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
        });
    }
  };

	return (
		<Center height="100vh">
			<VStack spacing={8} align="center" textAlign="center">
				<Image src={source} alt="AlphaMart Logo" maxW="300px" mb={4} />
				<Heading as="h1" size="xl" fontWeight="bold" color="black">
					Welcome to AlphaMart
				</Heading>
				<Text fontSize="lg" fontWeight="bold" color="gray.600">
					Thank you for choosing AlphaMart as your trusted grocery store. Click the button below to verify your account.
				</Text>
				<Button onClick={handleSubmit} color={"white"} bg={"black"} variant="solid" size="lg" mt={6}>
					Verify
				</Button>
			</VStack>
		</Center>
	);
};
