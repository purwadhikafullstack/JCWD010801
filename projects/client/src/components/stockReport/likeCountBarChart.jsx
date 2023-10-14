import axios from "axios";
import React, { useEffect, useState } from "react";
import { Flex } from "@chakra-ui/react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const LikeCountBarChart = () => {
	const [likeCountPerCategory, setLikeCountPerCategory] = useState([]);
	const [likeCount, setLikeCount] = useState(0);

	const fetchData = async () => {
		try {
			const response = await axios.get(
				`${process.env.REACT_APP_API_BASE_URL}/product-report/categories/statusCounts`
			);
			setLikeCountPerCategory(response.data.productCountsByCategory);
			const likeCount = await axios.get(
				`${process.env.REACT_APP_API_BASE_URL}/product-report/categories/statusAverages`
			);
			setLikeCount(likeCount.data.averageLikeCount);
		} catch (error) {
			console.log("Error fetching data:", error);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	const data = {
		labels: likeCountPerCategory.map((category) => category.categoryName),
		datasets: [
			{
				label: "Total Like Count",
				data: likeCountPerCategory.map((category) => category.totalLikeCount),
				backgroundColor: "#DA9100",
			},
			{
				label: "Avg. Like Count Across All Categories",
				data: Array(likeCountPerCategory.length).fill(likeCount),
				backgroundColor: "#000000",
			},
		],
	};

	const options = {
		responsive: true,
		plugins: {
			title: {
				display: true,
				text: "Product Like Count",
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

export default LikeCountBarChart;
