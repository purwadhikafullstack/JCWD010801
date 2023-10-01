import React from "react";
import { usePagination, useTable, useSortBy } from "react-table";
import { Box } from "@chakra-ui/react";
import TableContent from "./tableContent";
import Pagination from "./pagination";

function TableReport2({ dataReport, havePagination, queryObj, updateQueryObj, totalPage }) {
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
				disableSortBy: true,
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
				disableSortBy: true,
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
			{
				Header: "Branch",
				accessor: "branch",
				disableSortBy: true,
			},
		],
		[]
	);

	const data = React.useMemo(() => {
		return dataReport.result.map((order) => {
			return {
				id: order.id,
				username: order.Address.User.username,
				total: order.total,
				purchaseDate: new Date(order.createdAt).toLocaleDateString(),
				items: order.Order_details.map((orderDetail) => ({
					productName: orderDetail.Product.productName,
					quantity: orderDetail.quantity,
				})),
				branch: order.Cart.Branch.name,
			};
		});
	}, [dataReport.result]);
	const {
		
		gotoPage,
		nextPage,
		previousPage,
		
	} = useTable(
		{
			columns,
			data,
			manualSortBy: true,
			manualPagination: true, // Enable manual pagination
			initialState: {
				pageIndex: queryObj.page,
				pageSize: queryObj.limit,
			},
		},
		useSortBy,
		usePagination
	);

	
	const canPreviousPage = queryObj.page > 0;
	const canNextPage = queryObj.page < totalPage - 1;

	// Handle page size changes
	const handlePageSizeChange = (pageSize) => {
		// Update queryObj.limit to the new page size
		updateQueryObj({ ...queryObj, limit: pageSize, page: 0 }); // Reset to the first page when changing page size
	};

	return (
		<>
			<Box p={8}>
				<TableContent
					columns={columns}
					data={data}
					updateQueryObj={updateQueryObj}
					queryObj={queryObj}
				/>
				{havePagination && (
					<Pagination
						pageIndex={queryObj.page}
						pageCount={totalPage}
						canPreviousPage={canPreviousPage}
						canNextPage={canNextPage}
						gotoPage={gotoPage}
						previousPage={previousPage}
						nextPage={nextPage}
						pageSize={queryObj.limit}
						setPageSize={handlePageSizeChange} // Use the custom handler
						updateQueryObj={updateQueryObj}
					/>
				)}
			</Box>
		</>
	);
}

export default TableReport2;
