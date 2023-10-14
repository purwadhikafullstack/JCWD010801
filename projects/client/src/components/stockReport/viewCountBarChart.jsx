import axios from "axios";
import React, { useEffect, useState } from "react";
import { Flex } from "@chakra-ui/react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ViewCountBarChart = () => {
	const [viewCountPerCategory, setViewCountPerCategory] = useState([]);
	const [viewCount, setViewCount] = useState(0);

	const fetchData = async () => {
		try {
			const response = await axios.get(
				`${process.env.REACT_APP_API_BASE_URL}/product-report/categories/statusCounts`
			);
			setViewCountPerCategory(response.data.productCountsByCategory);
			const viewCount = await axios.get(
				`${process.env.REACT_APP_API_BASE_URL}/product-report/categories/statusAverages`
			);
			setViewCount(viewCount.data.averageViewCount);
		} catch (error) {
			console.log("Error fetching data:", error);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	const data = {
		labels: viewCountPerCategory.map((category) => category.categoryName),
		datasets: [
			{
				label: "Total View Count",
				data: viewCountPerCategory.map((category) => category.totalViewCount),
				backgroundColor: "#DA9100",
			},
			{
				label: "Avg. View Count Across All Categories",
				data: Array(viewCountPerCategory.length).fill(viewCount),
				backgroundColor: "#000000",
			},
		],
	};

	const options = {
		responsive: true,
		plugins: {
			title: {
				display: true,
				text: "Product View Count (Registered And Non-Registered Users)",
			},
		},
	};

	return (
		<Flex align={"center"} justify={"center"} w={"500px"} h={"300px"} mt={"50px"}>
			<Flex w={"500px"} h={"300px"}>
				<Bar data={data} options={options} />
			</Flex>
		</Flex>
	);
};

export default ViewCountBarChart;
