import { Table, Thead, Tbody, Tr, Th, Td, chakra, Box } from "@chakra-ui/react";
import { useTable, useSortBy, usePagination } from "react-table";
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import React, { useEffect, useState } from "react";

function TableContent({ columns, data, updateParams, params, handleSort }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page
  } = useTable(
    {
      columns,
      data
    },
    useSortBy,
    usePagination
  );

  const leftRadius = {
    borderTopLeftRadius: "0.5rem"
  };
  const rightRadius = {
    borderTopRightRadius: "0.5rem"
  };

  useEffect(() => {
    // Log the values of isSorted and isSortedDesc from the React-Table state
    headerGroups.forEach((headerGroup) => {
      headerGroup.headers.forEach((column) => {
        console.log(`${column.Header} - isSorted: ${column.isSorted}`);
        console.log(`${column.Header} - isSortedDesc: ${column.isSortedDesc}`);
      });
    });
  }, [headerGroups]); // Monitor changes in the sorting state

  console.log("params.sortBy", params);
  return (
    <Box
      py={5}
      roundedLeft="lg" // Rounded left corner
      roundedRight="lg" // Rounded right corner
      boxShadow="lg"
      overflowX="auto"
    >
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
                    {...column.getHeaderProps({
                      onClick: () => handleSort(column) // Call handleSort on click
                    })}
                    isNumeric={column.isNumeric}
                    px={4}
                    py={3}
                    bg="gray"
                    borderBottomWidth="1px"
                    fontWeight="bold"
                    css={
                      index === 0
                        ? leftRadius
                        : index === headerGroup.headers.length - 1
                        ? rightRadius
                        : ""
                    }
                  >
                    <chakra.div display="flex" alignItems="center">
                      {column.render("Header")}
                      {column.isSorted ? (
                        <chakra.span
                          aria-label={
                            column.isSortedDesc
                              ? "sorted descending"
                              : "sorted ascending"
                          }
                        >
                          {column.isSortedDesc ? (
                            <TriangleDownIcon />
                          ) : (
                            <TriangleUpIcon />
                          )}
                        </chakra.span>
                      ) : null}
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
