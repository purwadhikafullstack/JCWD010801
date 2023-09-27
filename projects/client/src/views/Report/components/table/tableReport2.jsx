import React, { useEffect } from "react";
import { usePagination, useTable, useSortBy } from "react-table";
import { Box } from "@chakra-ui/react";
import TableContent from "./tableContent";
import Pagination from "./pagination";

function TableReport2({  dataReport, havePagination, updateParams, params, page, setPage, sort, setSort, limit, setLimit,totalPage }) {
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
    canPreviousPage,
    canNextPage,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize } // Get the sorting parameters from state
  } = useTable(
    {
      columns,
      data,
      manualSortBy: true,
      initialState: {
        pageIndex: page,
        pageSize: totalPage,
      }
    },
    useSortBy,
    usePagination
  );

  const handleSort = (column) => {
    const newSortBy = column.id;
    // Check if the column is already sorted in ascending order
    const isAscending =
      column.isSortedDesc === undefined || !column.isSortedDesc;

    // Manually set isSorted and isSortedDesc
    column.isSorted = true;
    column.isSortedDesc = !isAscending;

    // Call the parent's updateParams to handle sorting and fetch data
    updateParams({
      sortBy: newSortBy,
      sortAs: isAscending ? "desc" : "asc"
    });
  };

  return (
    <>
      <Box>
        <TableContent
          columns={columns}
          data={data}
          updateParams={updateParams}
          params={params}
          handleSort={handleSort} // Pass the handleSort function to TableContent
        />
        {havePagination && (
          <Pagination
            pageIndex={pageIndex}
            pageCount={pageCount}
            canPreviousPage={canPreviousPage}
            canNextPage={canNextPage}
            gotoPage={gotoPage}
            previousPage={previousPage}
            nextPage={nextPage}
            pageSize={totalPage}
            setPageSize={setLimit}
            updateParams={updateParams}
          />
        )}
      </Box>
    </>
  );
}

export default TableReport2;
