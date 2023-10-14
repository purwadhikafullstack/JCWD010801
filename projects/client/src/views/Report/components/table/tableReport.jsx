import React from "react";
import { usePagination, useTable } from "react-table";
import { Box } from "@chakra-ui/react";
import TableContent from "./tableContent";
import Pagination from "./pagination";

function TableReport({ dataReport, havePagination, queryObj, updateQueryObj, totalPage }) {
	const columns = React.useMemo(
		() => [
			{
				Header: "Invoice",
				accessor: "invoice",
			},
			{
				Header: "Username",
				accessor: "username",
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
				Header: "Products",
				accessor: "items",
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
			},
		],
		[]
	);

	const data = React.useMemo(() => {
		return dataReport.result.map((order) => {
			return {
				invoice: order.invoice,
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
	const { gotoPage, nextPage, previousPage } = useTable(
		{
			columns,
			data,
			manualPagination: true, 
			initialState: {
				pageIndex: queryObj.page,
				pageSize: queryObj.limit,
			},
		},
		usePagination
	);

	const canPreviousPage = queryObj.page > 0;
	const canNextPage = queryObj.page < totalPage - 1;

	const handlePageSizeChange = (pageSize) => {
		updateQueryObj({ ...queryObj, limit: pageSize, page: 0 });
	};
	
	return (
		<>
			<Box p={8}>
				<TableContent columns={columns} data={data} updateQueryObj={updateQueryObj} queryObj={queryObj} />
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
						setPageSize={handlePageSizeChange}
						updateQueryObj={updateQueryObj}
					/>
				)}
			</Box>
		</>
	);
}

export default TableReport;
