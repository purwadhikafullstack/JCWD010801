import axios from "axios";
import React, { useEffect, useState } from "react";
import { Flex } from "@chakra-ui/react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BranchTxStackedBarChart = () => {
	const [tx, setTx] = useState([]);

	const fetchData = async () => {
		try {
			const txResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/product-report/branches/tx`);
			setTx(txResponse.data.result);
		} catch (error) {
			console.log("Error fetching branch tx data:", error);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	const data = {
		labels: tx.map((branch) => branch.name),
		datasets: [
			{
				label: "Sent Orders",
				data: tx.map((branch) => branch?.StockMovements?.txCount),
				backgroundColor: "#357B14",
			},
			{
				label: "Returned Orders",
				data: tx.map((branch) => branch?.StockMovements?.failedTxCount),
				backgroundColor: "#C41E3A",
			},
		],
	};

	const options = {
		plugins: {
			title: {
				display: true,
				text: "Branches' Transaction Status Distribution",
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
		<Flex align={"center"} justify={"center"} w={"500px"} h={"300px"} ml={"50px"} mt={"50px"}>
			<Flex w={"500px"} h={"300px"}>
				<Bar data={data} options={options} />
			</Flex>
		</Flex>
	);
};

export default BranchTxStackedBarChart;
