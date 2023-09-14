import { Box, Flex, Icon, Text, Stack } from "@chakra-ui/react"
import { BsArrowRight } from "react-icons/bs";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { MenuCategory } from "./menu";

export const CategoryCard = ({ id, isDeleted, categoryImage, category, to }) => {
    const navigate = useNavigate();
    const reduxStore = useSelector((state) => state?.user);
    const RoleId = reduxStore?.value?.RoleId || 1;

    return (
        <Box
        display={'flex'}
        flexWrap={'wrap'}
        borderRadius={'lg'}
        minW={{ base: '120px', sm: '180px', md: '240px' }}
        minH={{ base: '120px', sm: '180px', md: '240px' }}
        bgImage={categoryImage}
        bgSize={'cover'}
        bgPosition={'center'}
        bgRepeat={'no-repeat'}
        filter={isDeleted ? 'auto' : 'none'}
        brightness={isDeleted ? '40%' : '100%'}
        >
            <Stack
            w={'100%'}
            h={'100%'}
            bgColor={isDeleted ? null : 'blackAlpha.500'}
            borderRadius={'lg'}
            justifyContent={RoleId > 1 ? 'space-between' : 'flex-end'}
            p={{ base: 3, sm: 4, md: 5 }}
            alignItems={'start'}
            >
                {RoleId > 1 && (<MenuCategory id={id} categoryName={category} categoryImage={categoryImage} isDeleted={isDeleted} />)}
                <Flex
                bgColor={'white'}
                borderRadius={'lg'}
                w={'100%'}
                justifyContent={'space-between'}
                alignItems={'center'}
                p={{ base: '6px', sm: '10px', md: '14px' }}
                cursor={isDeleted ? null : 'pointer'}
                onClick={isDeleted ? null : () => navigate(to)}
                color={'blackAlpha.700'}
                _hover={isDeleted ? null : { color: 'black' }}
                >
                    <Text
                    fontWeight={'semibold'}
                    fontSize={{ base: '14px', md: '17px' }}
                    >
                        {category}
                    </Text>
                    <Icon as={BsArrowRight} w='5' h='5' />
                </Flex>
            </Stack>
        </Box>
    )
}