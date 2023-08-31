import { Button } from "@chakra-ui/react";

export const ButtonTemplate = ({ content, ...props }) => {
    return (
        <Button color={'white'} bgColor={'black'} boxShadow={'md'} {...props} >
            {content}
        </Button>
    )
}