import { Box, Flex, Icon, Text, Stack } from "@chakra-ui/react"
import { BsArrowRight } from "react-icons/bs";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { MenuCategory } from "./menu";

export const CategoryCard = ({ id, isDeleted, categoryImage, category, to }) => {
    const navigate = useNavigate();
    const { RoleId } = useSelector((state) => state.user.value);

    return (
        <Box
        display={'flex'}
        flexWrap={'wrap'}
        borderRadius={'lg'}
        minW={'240px'}
        minH={'240px'}
        bgImage={`url(${categoryImage})`}
        bgSize={'cover'}
        bgPosition={'center'}
        bgRepeat={'no-repeat'}
        // filter={isDeleted ? 'grayscale(40%)' : 'none'}
        filter={isDeleted ? 'auto' : 'none'}
        brightness={isDeleted ? '40%' : '100%'}
        >
            <Stack
            w={'100%'}
            h={'100%'}
            bgColor={isDeleted ? null : 'blackAlpha.500'}
            borderRadius={'lg'}
            justifyContent={'space-between'}
            p={5}
            alignItems={'start'}
            >
                {RoleId > 1 && (<MenuCategory id={id} categoryName={category} categoryImage={categoryImage} isDeleted={isDeleted} />)}
                <Flex
                bgColor={'white'}
                borderRadius={'lg'}
                w={'100%'}
                justifyContent={'space-between'}
                alignItems={'center'}
                p={'14px'}
                cursor={isDeleted ? null : 'pointer'}
                onClick={isDeleted ? null : () => navigate(to)}
                color={'blackAlpha.700'}
                _hover={isDeleted ? null : { color: 'black' }}
                >
                    <Text
                    fontWeight={'semibold'}
                    fontSize={'17px'}
                    >
                        {category}
                    </Text>
                    <Icon as={BsArrowRight} w='5' h='5' />
                </Flex>
            </Stack>
        </Box>
    )
}