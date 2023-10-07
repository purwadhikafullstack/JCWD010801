import axios from "axios";
import React, { useEffect, useState } from "react";
import { Flex } from "@chakra-ui/react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const StatusStackedBarChart = () => {
	const [status, setStatus] = useState([]);

	const fetchData = async () => {
		try {
			const deletedResponse = await axios.get(
				`${process.env.REACT_APP_API_BASE_URL}/product-report/categories/statusCounts`
			);
			setStatus(deletedResponse.data.productCountsByCategory);
		} catch (error) {
			console.log("Error fetching data:", error);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	const data = {
		labels: status.map((category) => category.categoryName),
		datasets: [
			{
				label: "Active",
				data: status.map((category) => category.activeProductsCount),
				backgroundColor: "#357B14",
			},
			{
				label: "Deactivated",
				data: status.map((category) => category.deactivatedProductsCount),
				backgroundColor: "#C41E3A",
			},
			{
				label: "Deleted",
				data: status.map((category) => category.deletedProductsCount),
				backgroundColor: "#7A0000",
			},
		],
	};

	const options = {
		plugins: {
			title: {
				display: true,
				text: "Categories' Product Status Distribution",
			},
		},
		responsive: true,
		scales: {
			x: {
				stacked: true,
			},
			y: {
				stacked: true,
			},
		},
	};

	return (
		<Flex align={"center"} justify={"center"} w={"500px"} h={"300px"}>
			<Flex w={"500px"} h={"300px"}>
				<Bar data={data} options={options} />
			</Flex>
		</Flex>
	);
};

export default StatusStackedBarChart;
