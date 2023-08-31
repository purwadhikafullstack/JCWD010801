import { Flex, Stack, Text, Icon, Popover, PopoverTrigger, PopoverContent, PopoverHeader, PopoverBody } from "@chakra-ui/react";
import { BsChevronDown } from "react-icons/bs";

export const Popover = ({ trigger, content }) => {
    return (
        <Popover>
            <PopoverTrigger>
                <Flex gap={3}>
                    {trigger}
                    <Icon as={BsChevronDown} w={4} h={4} color={'black'} />
                </Flex>
            </PopoverTrigger>
            <PopoverContent>
                <PopoverHeader>
                    <Text>
                        Select Branch Location
                    </Text>
                </PopoverHeader>
                <PopoverBody>
                    {content.map((item, index) => {
                        return (
                            <Text key={index}>
                                {item}
                            </Text>
                        )
                    })}
                </PopoverBody>
            </PopoverContent>
        </Popover>
    )
}