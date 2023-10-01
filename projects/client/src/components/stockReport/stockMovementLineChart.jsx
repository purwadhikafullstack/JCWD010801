import React, { useEffect, useState } from "react";
import Axios from "axios";
import { Flex, Stack, Text } from "@chakra-ui/react";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const StockMovementLineChart = ({
	sortedData,
	productName,
	isSearchEmpty,
	isDateFound,
	startDate,
	endDate,
	itemLimit,
	page,
	sortBy,
	sortOrder,
}) => {
	const [aggregateStock, setAggregateStock] = useState(0);
	const [aggregateStockHistory, setAggregateStockHistory] = useState({});

	useEffect(() => {
		Axios.get(
			`${process.env.REACT_APP_API_BASE_URL}/product-report/product/currentAggregate/?productName=${productName}`
		)
			.then((response) => {
				setAggregateStock(response.data.aggregateStock);
			})
			.catch((error) => {
				console.error("Error fetching current aggregate stock data:", error);
			});
		let historyURL = `${process.env.REACT_APP_API_BASE_URL}/product-report/product/trackAggregate/?productName=${productName}&page=${page}`;

		if (itemLimit) {
			historyURL += `&itemLimit=${itemLimit}`;
		}
		if (sortOrder) {
			historyURL += `&sortOrder=${sortOrder}`;
		}
		Axios.get(historyURL)
			.then((response) => {
				setAggregateStockHistory(response.data.aggregateStockHistory);
			})
			.catch((error) => {
				console.error("Error fetching aggregate stock history data:", error);
			});
	}, [productName, startDate, endDate, itemLimit, page, sortOrder]);

	const extractLastEntryForEachDate = (historyData) => {
		const result = {};
		for (const date in historyData) {
			const createdAtDate = new Date(date);
			const dayOfMonth = createdAtDate.getDate();
			const month = (createdAtDate.getMonth() + 1).toString().padStart(2, "0");
			const year = createdAtDate.getFullYear().toString().slice(-2);
			const hours = createdAtDate.getHours().toString().padStart(2, "0");
			const minutes = createdAtDate.getMinutes().toString().padStart(2, "0");
			const seconds = createdAtDate.getSeconds().toString().padStart(2, "0");
			const formattedDate = `${dayOfMonth}/${month}/${year} ${hours}:${minutes}:${seconds}`;
			result[formattedDate] = historyData[date];
		}
		return result;
	};

	const lastEntries = extractLastEntryForEachDate(aggregateStockHistory);

	if (isSearchEmpty || !isDateFound) {
		return (
			<Flex align={"center"} justify={"center"} w={"650px"} h={"320px"} ml={"20px"}>
				<Text
					color="#D90824"
					bgColor={"black"}
					fontWeight="bold"
					border={"1px solid black"}
					borderRadius={"35px"}
					p={"8px"}
				>
					Chart Data Not Available.
				</Text>
			</Flex>
		);
	}

	if (sortBy === "change") {
		return (
			<Stack align={"center"} justify={"center"} w={"650px"} h={"320px"} ml={"20px"}>
				<Text
					color="#D90824"
					bgColor={"black"}
					fontWeight="bold"
					border={"1px solid black"}
					borderRadius={"35px"}
					p={"8px"}
				>
					Chart Data Not Available.
				</Text>
				<Text
					color="#D90824"
					bgColor={"black"}
					fontWeight="bold"
					border={"1px solid black"}
					borderRadius={"35px"}
					p={"8px"}
				>
					No significant extrapolation can be made based on change delta data.
				</Text>
			</Stack>
		);
	}

	const labels = sortedData.map((entry) => {
		const createdAtDate = new Date(entry.createdAt);
		const dayOfMonth = createdAtDate.getDate();
		const month = (createdAtDate.getMonth() + 1).toString().padStart(2, "0");
		const year = createdAtDate.getFullYear().toString().slice(-2);
		const hours = createdAtDate.getHours().toString().padStart(2, "0");
		const minutes = createdAtDate.getMinutes().toString().padStart(2, "0");
		const seconds = createdAtDate.getSeconds().toString().padStart(2, "0");
		return `${dayOfMonth}/${month}/${year} ${hours}:${minutes}:${seconds}`;
	});

	const dataPoints1 = {};
	const dataPoints2 = {};
	const dataPoints3 = {};
	const dataPoints4 = {};
	const dataPoints5 = {};

	sortedData.forEach((entry) => {
		const createdAtDate = new Date(entry.createdAt);
		const dayOfMonth = createdAtDate.getDate();
		const month = (createdAtDate.getMonth() + 1).toString().padStart(2, "0");
		const year = createdAtDate.getFullYear().toString().slice(-2);
		const hours = createdAtDate.getHours().toString().padStart(2, "0");
		const minutes = createdAtDate.getMinutes().toString().padStart(2, "0");
		const seconds = createdAtDate.getSeconds().toString().padStart(2, "0");
		const formattedTimestamp = `${dayOfMonth}/${month}/${year} ${hours}:${minutes}:${seconds}`;
		const value = entry.newValue;

		if (entry.BranchId === 1) {
			dataPoints1[formattedTimestamp] = value;
		} else if (entry.BranchId === 2) {
			dataPoints2[formattedTimestamp] = value;
		} else if (entry.BranchId === 3) {
			dataPoints3[formattedTimestamp] = value;
		} else if (entry.BranchId === 4) {
			dataPoints4[formattedTimestamp] = value;
		} else if (entry.BranchId === 5) {
			dataPoints5[formattedTimestamp] = value;
		}
	});

	const lastEntriesLength = Object.keys(lastEntries).length;
	const dataPoints1Length = Object.keys(dataPoints1).length;
	const dataPoints2Length = Object.keys(dataPoints2).length;
	const dataPoints3Length = Object.keys(dataPoints3).length;
	const dataPoints4Length = Object.keys(dataPoints4).length;
	const dataPoints5Length = Object.keys(dataPoints5).length;

	const longestDataPointsLength = Math.max(
		dataPoints1Length,
		dataPoints2Length,
		dataPoints3Length,
		dataPoints4Length,
		dataPoints5Length,
		lastEntriesLength
	);

	const data = {
		labels,
		datasets: [
			{
				label: "Jakarta",
				data: dataPoints1,
				borderColor: "#E25668",
				backgroundColor: "#AFACAC",
			},
			{
				label: "Bandung",
				data: dataPoints2,
				borderColor: "#E28956",
				backgroundColor: "#AFACAC",
			},
			{
				label: "Jogjakarta",
				data: dataPoints3,
				borderColor: "#68E256",
				backgroundColor: "#AFACAC",
			},
			{
				label: "Surabaya",
				data: dataPoints4,
				borderColor: "#56E2CF",
				backgroundColor: "#AFACAC",
			},
			{
				label: "Batam",
				data: dataPoints5,
				borderColor: "#5668E2",
				backgroundColor: "#AFACAC",
			},
			{
				label: "Aggregate Nationwide Stock",
				data: lastEntries,
				borderColor: "#000000",
				backgroundColor: "#F7B6E7",
				borderDash: [25, 5],
			},
			{
				label: "Current Aggregate Benchmark",
				data: Array(longestDataPointsLength).fill(aggregateStock),
				borderColor: "#F7B6E7",
				backgroundColor: "#000000",
				borderDash: [5, 5],
			},
		],
	};

	const options = {
		responsive: true,
		plugins: {
			legend: {
				position: "top",
			},
			title: {
				display: true,
				text: "Stock Levels",
			},
		},
	};

	return (
		<Flex align={"center"} justify={"center"} w={"650px"} h={"320px"} ml={"20px"}>
			<Flex w={"650px"} h={"320px"}>
				<Line data={data} options={options} />
			</Flex>
		</Flex>
	);
};

export default StockMovementLineChart;
