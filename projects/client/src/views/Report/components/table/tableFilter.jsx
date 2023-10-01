import React from "react";
import {
	Box,
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
	const clearInput = (inputType) => {
		if (inputType === "startDate") {
			setQueryObj({ ...queryObj, startDate: "" });
		} else if (inputType === "endDate") {
			setQueryObj({ ...queryObj, endDate: "" });
		}
	};

	const handleSearchUserChange = (event) => {
		setQueryObj({ ...queryObj, searchUser: event.target.value });
	};

	const handleSearchChange = (event) => {
		setQueryObj({ ...queryObj, search: event.target.value });
	};

	const handleSearchProductChange = (event) => {
		setQueryObj({ ...queryObj, searchProduct: event.target.value });
	};

	const handleSearchBranchChange = (event) => {
		setQueryObj({ ...queryObj, searchBranch: event.target.value });
	};

	const handleSort = (event) => {
		setQueryObj({ ...queryObj, sort: event.target.value });
	};
console.log(branchId);
	return (
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
				<Box w={{ base: "100%", md: "auto" }}>
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
			<Box w={{ base: "100%", md: "auto" }}>
				<FormControl>
					<FormLabel color="gray.500">Sort By</FormLabel>
					<Select focusBorderColor="#373433" value={queryObj.sort} onChange={handleSort} borderColor="gray.300">
						<option value="desc">Newest</option>
						<option value="asc">Oldest</option>
					</Select>
				</FormControl>
			</Box>
			<Box w={{ base: "100%", md: "auto" }}>
				<FormControl>
					<FormLabel color="gray.500">Start Date</FormLabel>
					<InputGroup>
						<Input
							focusBorderColor="#373433"
							type="date"
							value={queryObj.startDate}
							onChange={(e) => setQueryObj({ ...queryObj, startDate: e.target.value })}
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
								onClick={() => clearInput("startDate")}
							/>
						</InputRightElement>
					</InputGroup>
				</FormControl>
			</Box>

			<Box w={{ base: "100%", md: "auto" }}>
				<FormControl>
					<FormLabel color="gray.500">End Date</FormLabel>
					<InputGroup>
						<Input
							focusBorderColor="#373433"
							type="date"
							value={queryObj.endDate}
							onChange={(e) => setQueryObj({ ...queryObj, endDate: e.target.value })}
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
								onClick={() => clearInput("endDate")}
							/>
						</InputRightElement>
					</InputGroup>
				</FormControl>
			</Box>

			<Box w={{ base: "100%", md: "auto" }}>
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

			<Box w={{ base: "100%", md: "auto" }}>
				<FormControl>
					<FormLabel color="gray.500">Search ID</FormLabel>
					<Input
						focusBorderColor="#373433"
						value={queryObj.search}
						onChange={handleSearchChange}
						placeholder="Search ID"
						borderColor="gray.300"
					/>
				</FormControl>
			</Box>

			<Box w={{ base: "100%", md: "auto" }}>
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
	);
};

export default TableFilter;
