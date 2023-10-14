import React from "react";
import {
	Box,
	Button,
	FormControl,
	FormLabel,
	Select,
	Grid,
	Input,
	InputGroup,
	InputRightElement,
	IconButton,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";

const TableFilter = ({ queryObj, setQueryObj, branches, branchId }) => {
	const clearInputDate = (inputType) => {
		setQueryObj({ ...queryObj, [inputType]: "" });
	};

	const clearAllInputs = () => {
		if (!branchId) {
			setQueryObj({
				searchBranch: "",
				sort: "desc",
				startDate: "",
				endDate: "",
				searchUser: "",
				search: "",
				searchProduct: "",
				page: 0,
				limit: 10,
			});
		} else if (branchId) {
			setQueryObj({
				searchBranch: branchId,
				sort: "desc",
				startDate: "",
				endDate: "",
				searchUser: "",
				search: "",
				searchProduct: "",
				page: 0,
				limit: 10,
			});
		}
	};

	const handleSearchUserChange = (event) => {
		setQueryObj({ ...queryObj, searchUser: event.target.value, page: 0 });
	};

	const handleSearchChange = (event) => {
		setQueryObj({ ...queryObj, search: event.target.value, page: 0 });
	};

	const handleSearchProductChange = (event) => {
		setQueryObj({ ...queryObj, searchProduct: event.target.value, page: 0 });
	};

	const handleSearchBranchChange = (event) => {
		setQueryObj({ ...queryObj, searchBranch: event.target.value, page: 0 });
	};

	const handleSort = (event) => {
		setQueryObj({ ...queryObj, sort: event.target.value, page: 0 });
	};

	return (
		<Box>
			<Grid
				templateColumns={{
					base: "1fr",
					md: "repeat(auto-fit, minmax(200px, 1fr))",
				}}
				gap={4}
				alignItems="center"
				justifyContent="center"
				mx={8}
			>
				{!branchId ? (
					<Box w={{ base: "80%", md: "auto" }}>
						<FormControl>
							<FormLabel color="gray.500">Select Branch</FormLabel>
							<Select value={queryObj.searchBranch} onChange={handleSearchBranchChange} borderColor="gray.300">
								<option value="">All Branches</option>
								{branches.map((value, index) => (
									<option key={index} value={value.id}>
										{value.name}
									</option>
								))}
							</Select>
						</FormControl>
					</Box>
				) : null}
				<Box w={{ base: "80%", md: "auto" }}>
					<FormControl>
						<FormLabel color="gray.500">Sort By</FormLabel>
						<Select focusBorderColor="#373433" value={queryObj.sort} onChange={handleSort} borderColor="gray.300">
							<option value="desc">Newest</option>
							<option value="asc">Oldest</option>
						</Select>
					</FormControl>
				</Box>
				<Box w={{ base: "80%", md: "auto" }}>
					<FormControl>
						<FormLabel color="gray.500">Start Date</FormLabel>
						<InputGroup>
							<Input
								focusBorderColor="#373433"
								type="date"
								value={queryObj.startDate}
								onChange={(e) => setQueryObj({ ...queryObj, startDate: e.target.value, page: 0 })}
								borderColor="gray.300"
							/>
							<InputRightElement width="2rem">
								<IconButton
									bg="none"
									color="red.500"
									_hover={{ bg: "none" }}
									_active={{ bg: "none" }}
									aria-label="Clear"
									icon={<CloseIcon />}
									size="sm"
									onClick={() => clearInputDate("startDate")}
								/>
							</InputRightElement>
						</InputGroup>
					</FormControl>
				</Box>

				<Box w={{ base: "80%", md: "auto" }}>
					<FormControl>
						<FormLabel color="gray.500">End Date</FormLabel>
						<InputGroup>
							<Input
								focusBorderColor="#373433"
								type="date"
								value={queryObj.endDate}
								onChange={(e) => setQueryObj({ ...queryObj, endDate: e.target.value, page: 0 })}
								borderColor="gray.300"
							/>
							<InputRightElement width="2rem">
								<IconButton
									bg="none"
									color="red.500"
									_hover={{ bg: "none" }}
									_active={{ bg: "none" }}
									aria-label="Clear"
									icon={<CloseIcon />}
									size="sm"
									onClick={() => clearInputDate("endDate")}
								/>
							</InputRightElement>
						</InputGroup>
					</FormControl>
				</Box>

				<Box w={{ base: "80%", md: "auto" }}>
					<FormControl>
						<FormLabel color="gray.500">Search User</FormLabel>
						<Input
							focusBorderColor="#373433"
							value={queryObj.searchUser}
							onChange={handleSearchUserChange}
							placeholder="Search User"
							borderColor="gray.300"
						/>
					</FormControl>
				</Box>

				<Box w={{ base: "80%", md: "auto" }}>
					<FormControl>
						<FormLabel color="gray.500">Search Invoice</FormLabel>
						<Input
							focusBorderColor="#373433"
							value={queryObj.search}
							onChange={handleSearchChange}
							placeholder="Search Invoice"
							borderColor="gray.300"
						/>
					</FormControl>
				</Box>

				<Box w={{ base: "80%", md: "auto" }}>
					<FormControl>
						<FormLabel color="gray.500">Search Product</FormLabel>
						<Input
							focusBorderColor="#373433"
							value={queryObj.searchProduct}
							onChange={handleSearchProductChange}
							placeholder="Search Product"
							borderColor="gray.300"
						/>
					</FormControl>
				</Box>
			</Grid>
			<Box w={{ base: "80%", md: "auto" }} mx={8} mt={4}>
				<Button bg="red.500" color="white" _hover={{ bg: "red.600" }} size="sm" onClick={clearAllInputs}>
					Clear All
				</Button>
			</Box>
		</Box>
	);
};

export default TableFilter;
