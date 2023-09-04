import { Image } from "@chakra-ui/react";

export const Slides = ({ card }) => {
    return (
        <>
        {card.map(({src}) => {
            return (
                <Image src={src} objectFit={'cover'} w={'100%'} />
            )
        })}
        </>
    )
}