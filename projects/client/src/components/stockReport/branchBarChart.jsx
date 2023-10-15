import axios from "axios";
import React, { useEffect, useState } from "react";
import { Flex } from "@chakra-ui/react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BranchBarChart = () => {
	const [branchData, setBranchData] = useState([]);
	const [averageCount, setAverageCount] = useState(0);

	const fetchData = async () => {
		try {
			const branchResponse = await axios.get(
				`${process.env.REACT_APP_API_BASE_URL}/product-report/branches/mostandleast`
			);
			setBranchData(branchResponse.data.branchProducts);
			const averageResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/product-report/branches/average`);
			setAverageCount(averageResponse.data.average);
		} catch (error) {
			console.log("Error fetching branch data:", error);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	const branchNames = Object.keys(branchData);
	const productCounts = branchNames.map((branchName) => branchData[branchName].productCount);

	const data = {
		labels: branchNames,
		datasets: [
			{
				label: "PPB",
				data: productCounts,
				backgroundColor: "#C3C1C1",
			},
			{
				label: "Avg. PPB Across All Branches",
				data: Array(branchNames.length).fill(averageCount),
				backgroundColor: "#000000",
			},
		],
	};

	const options = {
		responsive: true,
		plugins: {
			title: {
				display: true,
				text: "All AlphaMart Product Distribution Across Branches",
			},
		},
	};

	return (
		<Flex align={"center"} justify={"center"} w={"500px"} h={"300px"} ml={"50px"} mt={"50px"}>
			<Flex w={"500px"} h={"300px"}>
				<Bar data={data} options={options} />
			</Flex>
		</Flex>
	);
};

export default BranchBarChart;
