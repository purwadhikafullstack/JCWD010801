import Axios from "axios";
import Chart from "chart.js/auto";
import moment from "moment";
import { useEffect, useState, useRef } from "react";
import { Box, Stack, Text } from "@chakra-ui/react";
import { Navbar } from "../components/navbar";
import "chartjs-adapter-moment";

export const StockGraph = () => {
	const [salesData, setSalesData] = useState([]);
	const chartInstanceRef = useRef(null);

	useEffect(() => {
		Axios.get(`${process.env.REACT_APP_API_BASE_URL}/product`)
			.then((response) => {
				const { status, salesRecords } = response.data;
				if (status === 200) {
					setSalesData(salesRecords);
				} else {
					console.error("Error fetching sales data");
				}
			})
			.catch((error) => {
				console.error("Error fetching sales data:", error);
			});
	}, []);

	useEffect(() => {
		if (chartInstanceRef.current) {
			chartInstanceRef.current.destroy();
		}

		const formatSaleData = (data) => {
			const groupedData = {};
			data.forEach((record) => {
				const date = record.Transaction.txTime.split("T")[0];
				if (!groupedData[date]) {
					groupedData[date] = 0;
				}
				groupedData[date] += record.Product.totalAmount;
			});

			const dates = Object.keys(groupedData);
			const saleAmounts = Object.values(groupedData);
			return { dates, saleAmounts };
		};

		const salesChartData = formatSaleData(salesData);

		const handleChartClick = (event, elements) => {
			if (elements.length > 0) {
				const clickedElement = elements[0];
				const index = clickedElement.index;
				const date = salesChartData.dates[index];
				const momentDate = moment(date, "YYYY-MM-DD");
				const formattedDate = momentDate.add(1, "days").format("DD-MM-YYYY");
				const dynamicURL = `http://localhost:3000/sales/byDate/${formattedDate}`;
				window.location.href = dynamicURL;
			}
		};

		if (salesChartData.dates.length > 0) {
			const chartData = {
				labels: salesChartData.dates,
				datasets: [
					{
						label: "Sales",
						data: salesChartData.saleAmounts,
						fill: true,
						borderColor: "rgba(75,192,192,1)",
						tension: 0.4,
					},
				],
			};

			const chartOptions = {
				scales: {
					x: {
						type: "time",
						time: {
							parser: "YYYY-MM-DD",
							tooltipFormat: "ll",
							unit: "day",
							displayFormats: {
								day: "DD-MM-YYYY",
							},
						},
						title: {
							display: true,
							text: "Sale Dates",
							font: {
								size: 24,
							},
						},
						adapters: {
							date: moment,
						},
						ticks: {
							font: {
								size: 16,
							},
						},
					},
					y: {
						title: {
							display: true,
							text: "Sales In Rupiah",
							font: {
								size: 24,
							},
						},
						ticks: {
							font: {
								size: 16,
							},
						},
					},
				},
				onClick: handleChartClick,
			};

			const ctx = document.getElementById("salesGraph").getContext("2d");
			chartInstanceRef.current = new Chart(ctx, {
				type: "line",
				data: chartData,
				options: chartOptions,
			});
		}

		return () => {
			if (chartInstanceRef.current) {
				chartInstanceRef.current.destroy();
			}
		};
	}, [salesData]);

	return (
		<Box w="100%" h="100vh">
			<Navbar />
			<Stack
				h="20vh"
				pb="500px"
				spacing={0}
				position="relative"
				pt="110px"
				align="center"
				justify="center"
				fontFamily={"monospace"}
				fontSize={"35px"}
			>
				<Text>All Time Sales at AAA Shop</Text>
				<Stack p="100px" position="absolute" top="30px" left="0" right="0">
					<canvas id="salesGraph" />
				</Stack>
			</Stack>
		</Box>
	);
};
