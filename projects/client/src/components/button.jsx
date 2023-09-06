import { Button } from "@chakra-ui/react"

export const ButtonTemp = ({ content, ...props }) => {
    return (
        <Button
        bgColor={'#000000'}
        color={'white'}
        _hover={{
            color: '#0A0A0B',
            bg: '#F0F0F0',
            _before: { bg: 'inherit' },
            _after: { bg: 'inherit' }
        }}
        {...props}
        >
            {content}
        </Button>
    )
}