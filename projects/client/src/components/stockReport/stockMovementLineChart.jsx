import React from "react";
import { Flex } from "@chakra-ui/react";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const StockMovementLineChart = ({ sortedData }) => {
	const labels = sortedData.map((entry) => {
		const createdAtDate = new Date(entry.createdAt);
		const dayOfMonth = createdAtDate.getDate();
		const month = createdAtDate.getMonth();
		const year = createdAtDate.getFullYear().toString().slice(-2);
		return `${dayOfMonth}/${month}/${year}`;
	});
	const dataPoints1 = sortedData.filter((entry) => entry.BranchId === 1).map((entry) => entry.newValue);
	const dataPoints2 = sortedData.filter((entry) => entry.BranchId === 2).map((entry) => entry.newValue);
	const dataPoints3 = sortedData.filter((entry) => entry.BranchId === 3).map((entry) => entry.newValue);
	const dataPoints4 = sortedData.filter((entry) => entry.BranchId === 4).map((entry) => entry.newValue);
	const dataPoints5 = sortedData.filter((entry) => entry.BranchId === 5).map((entry) => entry.newValue);

	const data = {
		labels,
		datasets: [
			{
				label: "Jakarta",
				data: dataPoints1,
				borderColor: "#E25668",
				backgroundColor: "#AFACAC",
			},
			{
				label: "Bandung",
				data: dataPoints2,
				borderColor: "#E28956",
				backgroundColor: "#AFACAC",
			},
			{
				label: "Jogjakarta",
				data: dataPoints3,
				borderColor: "#AEE256",
				backgroundColor: "#AFACAC",
			},
			{
				label: "Surabaya",
				data: dataPoints4,
				borderColor: "#56E2CF",
				backgroundColor: "#AFACAC",
			},
			{
				label: "Batam",
				data: dataPoints5,
				borderColor: "#5668E2",
				backgroundColor: "#AFACAC",
			},
		],
	};

	const options = {
		responsive: true,
		plugins: {
			legend: {
				position: "top",
			},
			title: {
				display: true,
				text: "Stock Levels",
			},
		},
	};

	return (
		<Flex align={"center"} justify={"center"} w={"650px"} h={"320px"} ml={"20px"}>
			<Flex w={"650px"} h={"320px"}>
				<Line data={data} options={options} />
			</Flex>
		</Flex>
	);
};

export default StockMovementLineChart;
