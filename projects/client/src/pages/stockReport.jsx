import React, { useEffect, useState } from "react";
import Axios from "axios";
import { Box, Button, Stack, Text } from "@chakra-ui/react";
import { Navbar } from "../components/navbar";
import { Link } from "react-router-dom";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

export const StockReport = () => {
    const [dateRange, setDateRange] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: "selection",
        },
    ]);
    const [salesData, setSalesData] = useState([]);
    const [filteredSalesData, setFilteredSalesData] = useState([]);

    const removeDuplicateTransactions = (salesRecords) => {
        const uniqueTransactions = [];
        const seenTransactionIds = new Set();

        salesRecords.forEach((transaction) => {
            if (!seenTransactionIds.has(transaction.transactionId)) {
                uniqueTransactions.push(transaction);
                seenTransactionIds.add(transaction.transactionId);
            }
        });

        return uniqueTransactions;
    };

    const fetchAllSalesData = () => {
        Axios.get(`http://localhost:8000/api/transactions/sales`)
            .then((response) => {
                const { status, salesRecords } = response.data;
                if (status === 200 && salesRecords.length > 0) {
                    const uniqueSalesRecords = removeDuplicateTransactions(salesRecords);
                    setSalesData(uniqueSalesRecords);
                    setFilteredSalesData(uniqueSalesRecords);
                } else {
                    setSalesData([]);
                    setFilteredSalesData([]);
                }
            })
            .catch((error) => {
                console.error("Error fetching sales records:", error);
            });
    };

    const fetchSalesByDateRange = () => {
        const { startDate, endDate } = dateRange[0];
        const filteredData = salesData.filter((transaction) => {
            const txTime = new Date(transaction.Transaction.txTime);
            return txTime >= startDate && txTime <= endDate;
        });
        setFilteredSalesData(filteredData);
    };

    useEffect(() => {
        fetchAllSalesData();
    }, []);

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const formatDate2 = (dateStr) => {
        const dateObj = new Date(dateStr);
        const day = String(dateObj.getDate()).padStart(2, "0");
        const month = String(dateObj.getMonth() + 1).padStart(2, "0");
        const year = dateObj.getFullYear();
        const hours = String(dateObj.getHours()).padStart(2, "0");
        const minutes = String(dateObj.getMinutes()).padStart(2, "0");
        const seconds = String(dateObj.getSeconds()).padStart(2, "0");
        return `${day}-${month}-${year} at ${hours}:${minutes}:${seconds}`;
    };

    return (
        <Box w="100%" h="100vh">
            <Navbar />
            <Stack direction="column" h="20vh" top="0" zIndex="1" align={'center'} >
                <Text color="black" align="center" fontFamily="monospace" fontSize="35px" fontWeight="bold" mt="85px" mb={'35px'}>
                    Sales Records By Date Range
                </Text>
                <DateRangePicker ranges={dateRange} onChange={(item) => setDateRange([item.selection])} />
                <Button
                    onClick={fetchSalesByDateRange}
                    boxShadow="0px 0px 10px gray"
                    _hover={{ bgGradient: "linear(to-t, yellow.700, yellow.400)", transform: 'scale(0.95)' }}
                    color="white"
                    bgGradient="linear(to-t, yellow.400, yellow.700)"
                    mt="10px"
                >
                    Fetch Sales Records
                </Button>
            </Stack>
            {filteredSalesData.length > 0 ? (
                <Stack direction="column" spacing={4} overflowX="auto" padding="20px" mt="500px">
                    {filteredSalesData.map((transaction, index) => {
                        return (
                            <Box key={transaction.transactionId} p={4} border="1px solid #ccc">
                                <p>Transaction ID: {transaction.transactionId}</p>
                                <p>Transaction Time: {formatDate2(transaction.Transaction.txTime)}</p>
                                <p>Billed: Rp. {transaction.Product.totalAmount.toLocaleString("id-ID")},00</p>
                                <Button
                                    as={Link}
                                    to={`/sales/${transaction.transactionId}`}
                                    boxShadow="0px 0px 10px gray"
                                    _hover={{ bgGradient: "linear(to-t, yellow.700, yellow.400)", transform: 'scale(0.95)' }}
                                    color="white"
                                    bgGradient="linear(to-t, yellow.400, yellow.700)"
                                    mt="10px"
                                >
                                    See Detail
                                </Button>
                            </Box>
                        );
                    })}
                </Stack>
            ) : (
                <>
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <p>No sales records found for the selected date range.</p>
                </>
            )}
        </Box>
    );
};
