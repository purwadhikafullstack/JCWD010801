import axios from "axios";
import React, { useEffect, useState } from "react";
import { Flex } from "@chakra-ui/react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const CategoryBarChart = () => {
	const [categoryData, setCategoryData] = useState([]);
	const [averageCount, setAverageCount] = useState(0);

	const fetchData = async () => {
		try {
			const categoryResponse = await axios.get(
				`${process.env.REACT_APP_API_BASE_URL}/product-report/categories/mostandleast`
			);
			setCategoryData(categoryResponse.data.result);
			const averageResponse = await axios.get(
				`${process.env.REACT_APP_API_BASE_URL}/product-report/categories/average`
			);
			setAverageCount(averageResponse.data.result);
		} catch (error) {
			console.log("Error fetching data:", error);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	const data = {
		labels: categoryData.map((category) => category.category),
		datasets: [
			{
				label: "PPC",
				data: categoryData.map((category) => category.productCount),
				backgroundColor: "#C3C1C1",
			},
			{
				label: "Avg. Total PIDs In A Given Category",
				data: Array(categoryData.length).fill(averageCount),
				backgroundColor: "#000000",
			},
		],
	};

	const options = {
		responsive: true,
		plugins: {
			title: {
				display: true,
				text: "Mean Comparison",
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

export default CategoryBarChart;
