import { Table, Thead, Tbody, Tr, Th, Td, chakra, Box } from "@chakra-ui/react";
import { useTable, useSortBy, usePagination } from "react-table";

function TableContent({ columns, data }) {
	const { getTableProps, getTableBodyProps, headerGroups, prepareRow, page } = useTable(
		{
			columns,
			data,
			manualPagination: true,
		},
		useSortBy,
		usePagination
	);

	const leftRadius = {
		borderTopLeftRadius: "0.5rem",
	};
	const rightRadius = {
		borderTopRightRadius: "0.5rem",
	};

	return (
		<Box py={5} roundedLeft="lg" roundedRight="lg" boxShadow="lg" overflowX="auto">
			{!columns ||
			!Array.isArray(columns) ||
			columns.length === 0 ||
			!data ||
			!Array.isArray(data) ||
			data.length === 0 ? (
				<Box p={5}>No data to display</Box>
			) : (
				<Table {...getTableProps()} variant="simple" colorScheme="blue">
					<Thead>
						{headerGroups.map((headerGroup) => (
							<Tr {...headerGroup.getHeaderGroupProps()}>
								{headerGroup.headers.map((column, index) => (
									<Th
										key={index}
										isNumeric={column.isNumeric}
										px={4}
										py={3}
										bg="gray"
										color="white"
										borderBottomWidth="1px"
										fontWeight="bold"
										css={index === 0 ? leftRadius : index === headerGroup.headers.length - 1 ? rightRadius : ""}
									>
										<chakra.div display="flex" alignItems="center">
											{column.render("Header")}
										</chakra.div>
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
										<Td
											{...cell.getCellProps()}
											isNumeric={cell.column.isNumeric}
											px={4}
											py={2}
											borderBottomWidth="1px"
										>
											{cell.render("Cell")}
										</Td>
									))}
								</Tr>
							);
						})}
					</Tbody>
				</Table>
			)}
		</Box>
	);
}

export default TableContent;
