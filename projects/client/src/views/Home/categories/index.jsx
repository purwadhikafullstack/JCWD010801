import { CategoryCarousel } from "./carousel"
import { Stack, Heading } from "@chakra-ui/react";

export const Categories = () => {
    return (
        <Stack gap={'3'} w='100%'>
            <Heading fontSize={'3xl'} fontWeight={'semibold'}>
                Categories
            </Heading>
            <CategoryCarousel/>
        </Stack>
    )
}