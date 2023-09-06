import { Box, Heading, Text } from "@chakra-ui/react"
import { ForgotPasswordField } from "./components/field"

export const ForgotPasswordView = () => {
    return (
        <Box mt={["0px", "0px", "100px"]} mx={'30px'}>
            <Heading 
            w={"200px"} 
            mr={["0px", "150px", "150px"]} 
            mb={"20px"} 
            fontSize={"30px"} 
            fontFamily={"monospace"}>Forgot Your Password?</Heading>
            <Text fontWeight={'light'} fontSize={'15px'} mb={'20px'} >
                Don't worry! Just enter your email and you'll receive a link to reset your password.
            </Text>
            <ForgotPasswordField />
        </Box>
    )
}