import axios from "axios";
import "react-toastify/dist/ReactToastify.css";import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { Button, Flex, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";

const formatTime = (time) => {
	return time < 10 ? `0${time}` : time;
};

const calculateTimeRemaining = (timeout) => {
	const currentTime = new Date().getTime();
	const endTime = new Date(timeout).getTime();
	const timeDiff = endTime - currentTime;

	if (timeDiff <= 0) {
		return { hours: "00", minutes: "00", seconds: "00" };
	}

	const totalSeconds = Math.floor(timeDiff / 1000);
	const hours = Math.floor(totalSeconds / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const seconds = totalSeconds % 60;

	return {
		hours: formatTime(hours),
		minutes: formatTime(minutes),
		seconds: formatTime(seconds),
	};
};

export const ResendVerification = () => {
    const token = localStorage.getItem("token");
    const timeout = localStorage.getItem("timeout");
    const [timeRemaining, setTimeRemaining] = useState(calculateTimeRemaining(timeout));
    const { isVerified } = useSelector((state) => state?.user?.value);
    const handleSubmit = async() => {
        try {
            await axios.patch(`${process.env.REACT_APP_API_BASE_URL}/user/reverify`, {}, {
                headers: {
                    authorization: `Bearer ${token}`
                }
            });
            const newTimeout = new Date(Date.now()).getTime() + 300000
            localStorage.setItem("timeout", new Date(newTimeout));
            setTimeRemaining(new Date(newTimeout))

            toast.success("Verification Email Sent", {
                position: "top-right",
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        } catch (err) {
            toast.error(err.response.data.message, {
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
    };

    useEffect(() => {
		const intervalId = setInterval(() => {
			const remaining = calculateTimeRemaining(timeout);
			setTimeRemaining(remaining);
		}, 1000);

		return () => clearInterval(intervalId);
        // eslint-disable-next-line
	}, [timeRemaining]);

    return (
        <Flex 
        px={5} 
        py={1}
        justifyContent={"space-between"} 
        w={"100%"} 
        alignItems={"center"} 
        display={isVerified ? "none" : "flex"}
        fontSize={"15px"}
        bgColor={"red.100"}
        >
            <Text>
                You need to verify your account in order to do any transaction.
            </Text>
            {timeRemaining && (
                <Text>
                    Resend available in {timeRemaining?.minutes} : {timeRemaining?.seconds}
                </Text>
            )}
            <Button 
            _hover={{ bgColor: "red.100" }} 
            onClick={handleSubmit} 
            bgColor={"inherit"}
            isDisabled={timeRemaining && new Date(Date.now()).getTime() < new Date(timeout).getTime() ? true : false}
            borderRadius={"full"}>
                Send Email
            </Button>
        </Flex>
    )
}