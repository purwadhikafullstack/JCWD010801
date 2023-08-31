import { Flex } from "@chakra-ui/react";

export const Footer = ({isNotDisabled = true}) => {
    return (
        <>
        {isNotDisabled && (
            <Flex w='100vw' h='100px' bgColor='red'>
                
            </Flex>
        )}
        </>
    )
}