import axios from "axios";
import React, { useEffect, useState } from "react";
import { Flex } from "@chakra-ui/react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DeactivatedProductsBarChart = () => {
	const [deactivatedCountPerCategory, setDeactivatedCountPerCategory] = useState([]);
	const [deactivatedCount, setDeactivatedCount] = useState(0);

	const fetchData = async () => {
		try {
			const deactivatedResponse = await axios.get(
				`${process.env.REACT_APP_API_BASE_URL}/product-report/categories/statusCounts`
			);
			setDeactivatedCountPerCategory(deactivatedResponse.data.productCountsByCategory);
			const deactivatedCount = await axios.get(
				`${process.env.REACT_APP_API_BASE_URL}/product-report/categories/statusAverages`
			);
			setDeactivatedCount(deactivatedCount.data.averageDeactivatedProductCount);
		} catch (error) {
			console.log("Error fetching data:", error);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	const data = {
		labels: deactivatedCountPerCategory.map((category) => category.categoryName),
		datasets: [
			{
				label: "Deactivated PIDs",
				data: deactivatedCountPerCategory.map((category) => category.deactivatedProductsCount),
				backgroundColor: "#C41E3A",
			},
			{
				label: "Avg. Deactivated PIDs Across All Categories",
				data: Array(deactivatedCountPerCategory.length).fill(deactivatedCount),
				backgroundColor: "#000000",
			},
		],
	};

	const options = {
		responsive: true,
		plugins: {
			title: {
				display: true,
				text: "Deactivated Products",
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

export default DeactivatedProductsBarChart;
