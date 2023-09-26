import {
	ArrowLeftIcon,
	ArrowRightIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
	TriangleDownIcon,
	TriangleUpIcon,
} from "@chakra-ui/icons";
import {
	Box,
	Flex,
	IconButton,
	NumberDecrementStepper,
	NumberIncrementStepper,
	NumberInput,
	NumberInputField,
	NumberInputStepper,
	Select,
	Table,
	Tbody,
	Td,
	Text,
	Th,
	Thead,
	Tooltip,
	Tr,
	chakra,
	Input,
	InputRightElement,
	InputGroup,
} from "@chakra-ui/react";
import Axios from "axios";
import React, { useEffect, useState } from "react";
import { usePagination, useSortBy, useTable } from "react-table";
import { DeleteIcon } from "@chakra-ui/icons"; // Icon "X" dari Chakra UI

function CustomTable({ columns, data }) {
	// Use the state and functions returned from useTable to build your UI
	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		prepareRow,
		page, // Instead of using 'rows', we'll use page,
		// which has only the rows for the active page

		// The rest of these things are super handy, too ;)
		canPreviousPage,
		canNextPage,
		pageOptions,
		pageCount,
		gotoPage,
		nextPage,
		previousPage,
		setPageSize,
		state: { pageIndex, pageSize },
	} = useTable(
		{
			columns,
			data,
			initialState: { pageIndex: 0 },
		},
		useSortBy,
		usePagination
	);

	// Render the UI for your table
	return (
		<>
			<Table {...getTableProps()}>
				<Thead>
					{headerGroups.map((headerGroup) => (
						<Tr {...headerGroup.getHeaderGroupProps()}>
							{headerGroup.headers.map((column) => (
								<Th {...column.getHeaderProps(column.getSortByToggleProps())} isNumeric={column.isNumeric}>
									{column.render("Header")}
									<chakra.span pl="4">
										{column.isSorted ? (
											column.isSortedDesc ? (
												<TriangleDownIcon aria-label="sorted descending" />
											) : (
												<TriangleUpIcon aria-label="sorted ascending" />
											)
										) : null}
									</chakra.span>
								</Th>
							))}
						</Tr>
					))}
				</Thead>
				<Tbody {...getTableBodyProps()}>
					{page.map((row) => {
						prepareRow(row);
						return (
							<Tr {...row.getRowProps()}>
								{row.cells.map((cell) => (
									<Td {...cell.getCellProps()} isNumeric={cell.column.isNumeric}>
										{cell.render("Cell")}
									</Td>
								))}
							</Tr>
						);
					})}
				</Tbody>
			</Table>

			<Flex justifyContent="space-between" m={4} alignItems="center">
				<Flex>
					<Tooltip label="First Page">
						<IconButton
							onClick={() => gotoPage(0)}
							isDisabled={!canPreviousPage}
							icon={<ArrowLeftIcon h={3} w={3} />}
							mr={4}
						/>
					</Tooltip>
					<Tooltip label="Previous Page">
						<IconButton onClick={previousPage} isDisabled={!canPreviousPage} icon={<ChevronLeftIcon h={6} w={6} />} />
					</Tooltip>
				</Flex>

				<Flex alignItems="center">
					<Text flexShrink="0" mr={8}>
						Page{" "}
						<Text fontWeight="bold" as="span">
							{pageIndex + 1}
						</Text>{" "}
						of{" "}
						<Text fontWeight="bold" as="span">
							{pageOptions.length}
						</Text>
					</Text>
					<Text flexShrink="0">Go to page:</Text>{" "}
					<NumberInput
						ml={2}
						mr={8}
						w={28}
						min={1}
						max={pageOptions.length}
						onChange={(value) => {
							const page = value ? value - 1 : 0;
							gotoPage(page);
						}}
						defaultValue={pageIndex + 1}
					>
						<NumberInputField />
						<NumberInputStepper>
							<NumberIncrementStepper />
							<NumberDecrementStepper />
						</NumberInputStepper>
					</NumberInput>
					<Select
						w={32}
						value={pageSize}
						onChange={(e) => {
							setPageSize(Number(e.target.value));
						}}
					>
						{[10, 20, 30, 40, 50].map((pageSize) => (
							<option key={pageSize} value={pageSize}>
								Show {pageSize}
							</option>
						))}
					</Select>
				</Flex>

				<Flex>
					<Tooltip label="Next Page">
						<IconButton onClick={nextPage} isDisabled={!canNextPage} icon={<ChevronRightIcon h={6} w={6} />} />
					</Tooltip>
					<Tooltip label="Last Page">
						<IconButton
							onClick={() => gotoPage(pageCount - 1)}
							isDisabled={!canNextPage}
							icon={<ArrowRightIcon h={3} w={3} />}
							ml={4}
						/>
					</Tooltip>
				</Flex>
			</Flex>
		</>
	);
}

const TableReport = ({ dataReport, startDate, setStartDate, endDate, setEndDate, searchUser, setSearchUser, search, setSearch, searchProduct, setSearchProduct }) => {
	const currentYear = new Date().getFullYear();
	const [selectedYear, setSelectedYear] = useState(currentYear.toString());
	const availableYears = Object.keys(dataReport.groupedResults);
	availableYears.sort((a, b) => parseInt(b) - parseInt(a));
	
	const clearInput = (inputType) => {
		if (inputType === "startDate") {
		  setStartDate("");
		} else if (inputType === "endDate") {
		  setEndDate("");
		}
	  };
	const columns = React.useMemo(
		() => [
			{
				Header: "ID",
				accessor: "id",
				disableSortBy: true,
			},
			{
				Header: "Username",
				accessor: "username",
				disableSortBy: true,
			},
			{
				Header: "Total",
				accessor: "total",
				Cell: ({ value }) => {
					const formattedTotal = new Intl.NumberFormat("id-ID", {
						style: "currency",
						currency: "IDR",
					}).format(value);

					return <>{formattedTotal}</>;
				},
			},
			{
				Header: "Purchase Date",
				accessor: "purchaseDate",
			},
			{
				Header: "Items",
				accessor: "items",
				disableSortBy: true,
				Cell: ({ value }) => {
					return (
						<Box>
							{value.map((item, index) => (
								<Box key={index}>
									{item.productName} x {item.quantity}
								</Box>
							))}
						</Box>
					);
				},
			},
		],
		[]
	);

	const data = React.useMemo(() => {
		if (selectedYear && dataReport.groupedResults[selectedYear]) {
			const yearData = dataReport.groupedResults[selectedYear];
			return yearData.orders.map((order) => {
				return {
					id: order.id,
					username: order.Address.User.username,
					total: order.total,
					purchaseDate: new Date(order.createdAt).toLocaleDateString(),
					items: order.Order_details.map((orderDetail) => ({
						productName: orderDetail.Product.productName,
						quantity: orderDetail.quantity,
					})),
				};
			});
		}
		return [];
	}, [selectedYear, dataReport.groupedResults]);
	const handleSearchUserChange = (event) => {
		setSearchUser(event.target.value);
		
	  };
	const handleSearchChange = (event) => {
		setSearch(event.target.value);
		
	  };
	const handleSearchProductChange = (event) => {
		setSearchProduct(event.target.value);
		
	  };
	
	return (
		<Box p="5rem">
			<Select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
				{availableYears.map((year) => (
					<option key={year} value={year}>
						{year}
					</option>
				))}
			</Select>
			<Flex>
          <InputGroup>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <InputRightElement width="2rem">
              <IconButton
                aria-label="Clear"
                icon={<DeleteIcon />}
                size="sm"
                onClick={() => clearInput("startDate")}
              />
            </InputRightElement>
          </InputGroup>
        </Flex>
        <Flex>
          <InputGroup>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
            <InputRightElement width="2rem">
              <IconButton
                aria-label="Clear"
                icon={<DeleteIcon />}
                size="sm"
                onClick={() => clearInput("endDate")}
              />
            </InputRightElement>
          </InputGroup>
        </Flex>
		  <Input value={searchUser} onChange={handleSearchUserChange} placeholder="search user"/>
		  <Input value={search} onChange={handleSearchChange} placeholder="search id"/>
		  <Input value={searchProduct} onChange={handleSearchProductChange} placeholder="search product"/>
			<CustomTable columns={columns} data={data} />
		</Box>
	);
};

export default TableReport;
