import Axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
	Input,
	Button,
	Drawer,
	DrawerBody,
	DrawerHeader,
	DrawerContent,
	DrawerOverlay,
	Flex,
	Icon,
	Text,
	useDisclosure,
} from "@chakra-ui/react";
import { LuSearch } from "react-icons/lu";
import { RxCross1 } from "react-icons/rx";

export const SearchMobile = () => {
	const navigate = useNavigate();
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
			const response = await Axios.get(
				`${process.env.REACT_APP_API_BASE_URL}/product/all?page=1&sortBy=productName&sortOrder=ASC&itemLimit=10&search=${search}`
			);
			setSearchResults(response.data.result);
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleDrawerClose = () => {
		setSearchResults([]);
		onClose();
	};

	useEffect(() => {
		if (search.trim() !== "") {
			handleSearch();
		}
		// eslint-disable-next-line
	}, [search]);

	return (
		<>
			<Button onClick={onOpen} bgColor={"white"} rounded={"full"} display={{ base: "block", md: "none" }}>
				<Icon as={LuSearch} display={{ base: "block", sm: "none" }} w="5" h="5" color={"black"} />
			</Button>
			<Drawer isOpen={isOpen} placement={"top"} onClose={handleDrawerClose} size={"xs"} initialFocusRef={null}>
				<DrawerOverlay>
					<DrawerContent>
						<DrawerHeader>
							<Flex alignItems={"center"}>
								<Input
									type={"search"}
									value={search}
									focusBorderColor="gray.300"
									w="100%"
									placeholder="Search for Products"
									onChange={(e) => setSearch(e.target.value)}
									onKeyDown={(e) => {
										if (e.key === "Enter") {
											navigate(`/search/products/${search}`);
										}
									}}
								/>
								<Button onClick={handleDrawerClose} bgColor={"white"} rounded={"full"}>
									<Icon as={RxCross1} color={"black"} w="5" h="5" />
								</Button>
							</Flex>
						</DrawerHeader>
						<DrawerBody>
							{isLoading ? (
								<Text fontSize={"medium"} fontWeight={"medium"}>
									Searching...
								</Text>
							) : searchResults.length > 0 ? (
								searchResults.map((item, idx) => {
									return (
										<Text
											key={item.id}
											onClick={() => {
												handleDrawerClose();
												navigate(`/product/${item.id}`);
											}}
											cursor="pointer"
										>
											{item.productName}
										</Text>
									);
								})
							) : (
								<Text fontSize={"medium"} fontWeight={"medium"}>
									No results found.
								</Text>
							)}
						</DrawerBody>
					</DrawerContent>
				</DrawerOverlay>
			</Drawer>
		</>
	);
};
