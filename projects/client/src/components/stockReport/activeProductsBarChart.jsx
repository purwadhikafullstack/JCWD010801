import axios from "axios";
import React, { useEffect, useState } from "react";
import { Flex } from "@chakra-ui/react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ActiveProductsBarChart = () => {
	const [activeCountPerCategory, setActiveCountPerCategory] = useState([]);
	const [activeCount, setActiveCount] = useState(0);

	const fetchData = async () => {
		try {
			const activeResponse = await axios.get(
				`${process.env.REACT_APP_API_BASE_URL}/product-report/categories/statusCounts`
			);
			setActiveCountPerCategory(activeResponse.data.productCountsByCategory);
			const activeCount = await axios.get(
				`${process.env.REACT_APP_API_BASE_URL}/product-report/categories/statusAverages`
			);
			setActiveCount(activeCount.data.averageActiveProductCount);
		} catch (error) {
			console.log("Error fetching data:", error);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	const data = {
		labels: activeCountPerCategory.map((category) => category.categoryName),
		datasets: [
			{
				label: "Active PIDs",
				data: activeCountPerCategory.map((category) => category.activeProductsCount),
				backgroundColor: "#357B14",
			},
			{
				label: "Avg. Active PIDs Across All Categories",
				data: Array(activeCountPerCategory.length).fill(activeCount),
				backgroundColor: "#000000",
			},
		],
	};

	const options = {
		responsive: true,
		plugins: {
			title: {
				display: true,
				text: "Active Products",
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

export default ActiveProductsBarChart;
