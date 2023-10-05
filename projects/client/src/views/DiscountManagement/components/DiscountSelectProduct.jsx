import { Flex, Icon, Input, Modal, ModalBody, ModalContent, ModalHeader, ModalOverlay, InputLeftElement, Text, useDisclosure, InputGroup, Image, Stack, Spacer, Spinner } from "@chakra-ui/react"
import { ButtonTemp } from "../../../components/button";
import { useEffect, useState } from "react";
import axios from "axios";
import { LuSearch } from "react-icons/lu";
import { AiOutlinePlus } from "react-icons/ai";

export const DiscountSelectProduct = ({ setSelectedProduct, isVoucher = true }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [search, setSearch] = useState("");
	const [searchResults, setSearchResults] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
    
	const handleSearch = async () => {
        if (search.trim() === "") {
			return;
		}
		setIsLoading(true);
		try {
			const { data } = await axios.get(
				`${process.env.REACT_APP_API_BASE_URL}/product/all?page=1&sortBy=productName&sortOrder=ASC&itemLimit=10&search=${search}`
			);
			setSearchResults(data.result);
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleDrawerClose = () => {
        setSearch("")
		setSearchResults([]);
		onClose();
	};
    
    const handlePassProps = (value) => {
        if ( isVoucher ) setSelectedProduct(value)
        else setSelectedProduct(selectedProduct => [...selectedProduct, value])
    }

    useEffect(() => {
		if (search.trim() !== "") {
			handleSearch();
		}
		// eslint-disable-next-line
	}, [search]);

    return (
        <>
        <ButtonTemp content={isVoucher ? "Select Product" : "Add Product"} onClick={onOpen} />
        <Modal scrollBehavior="inside" size={"xl"} isOpen={isOpen} onClose={handleDrawerClose}>
            <ModalOverlay/>
            <ModalContent>
                <ModalHeader>
                    <InputGroup alignItems={"center"} justifyContent={"center"} w={"100%"}>
                        <Input
                            type={"search"}
                            value={search}
                            variant={"flushed"}
                            w="100%"
                            placeholder="Search for products"
                            border={"none"}
                            focusBorderColor="gray.300"
                            size={"lg"}
                            fontSize={"20px"}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <InputLeftElement>
                            <Icon mt={2} ml={2} w={6} h={6} as={LuSearch} />
                        </InputLeftElement>
                    </InputGroup>
                </ModalHeader>
                <ModalBody p={3}>
                    {isLoading ? (
                        <Stack w={"100%"} p={10} alignItems={"center"} justifyContent={"center"}>
                            <Spinner size={"xl"} thickness="4px"/>
                        </Stack>
                    ) : searchResults.length > 0 ? (
                        <Stack w={"100%"} gap={3}>
                            {searchResults.map((item) => {
                                return (
                                    <Flex 
                                    key={item.id}
                                    onClick={() => {
                                        handleDrawerClose();
                                        handlePassProps(item);
                                    }}
                                    cursor="pointer"
                                    alignItems={"center"}
                                    bgColor={"gray.100"}
                                    p={3}
                                    borderRadius={"7px"}
                                    >
                                        <Image
                                            src={`${process.env.REACT_APP_BASE_URL}/products/${item?.imgURL}`}
                                            alt={item.productName}
                                            boxSize="90px"
                                            objectFit="cover"
                                            borderRadius={"7px"}
                                            mr={3}
                                        />
                                        <Stack justifyContent={"center"}>
                                            <Text fontWeight={"normal"} color={"gray"} fontSize={"sm"} >{item.CategoryId}</Text>
                                            <Text fontWeight={"medium"} fontSize={"lg"}>
                                                {item.productName}
                                            </Text>
                                        </Stack>
                                        <Spacer/>
                                        <Icon as={AiOutlinePlus} w={8} h={8} />
                                    </Flex>
                                );
                            })}
                        </Stack>
                    ) : (
                        <Stack px={3} pb={3}>
                            <Text fontSize={"lg"} fontWeight={"medium"}>
                                No results found
                            </Text>
                        </Stack>
                    )}
                </ModalBody>
            </ModalContent>
        </Modal>
        </>
    )
}