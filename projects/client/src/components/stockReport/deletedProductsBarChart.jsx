import axios from "axios";
import React, { useEffect, useState } from "react";
import { Flex } from "@chakra-ui/react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DeletedProductsBarChart = () => {
	const [deletedCountPerCategory, setDeletedCountPerCategory] = useState([]);
	const [deletedCount, setDeletedCount] = useState(0);

	const fetchData = async () => {
		try {
			const deletedResponse = await axios.get(
				`${process.env.REACT_APP_API_BASE_URL}/product-report/categories/statusCounts`
			);
			setDeletedCountPerCategory(deletedResponse.data.productCountsByCategory);
			const deletedCount = await axios.get(
				`${process.env.REACT_APP_API_BASE_URL}/product-report/categories/statusAverages`
			);
			setDeletedCount(deletedCount.data.averageDeletedProductCount);
		} catch (error) {
			console.log("Error fetching data:", error);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	const data = {
		labels: deletedCountPerCategory.map((category) => category.categoryName),
		datasets: [
			{
				label: "Deleted PIDs",
				data: deletedCountPerCategory.map((category) => category.deletedProductsCount),
				backgroundColor: "#8F0024",
			},
			{
				label: "Avg. Deleted PIDs Across All Categories",
				data: Array(deletedCountPerCategory.length).fill(deletedCount),
				backgroundColor: "#000000",
			},
		],
	};

	const options = {
		responsive: true,
		plugins: {
			title: {
				display: true,
				text: "Deleted Products",
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

export default DeletedProductsBarChart;
