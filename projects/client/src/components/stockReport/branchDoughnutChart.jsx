import axios from "axios";
import React, { useEffect, useState } from "react";
import { Flex } from "@chakra-ui/react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
ChartJS.register(ArcElement, Tooltip, Legend);

const BranchDoughnutChart = () => {
	const [branchData, setBranchData] = useState([]);

	const fetchData = async () => {
		try {
			const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/product-report/branches/mostandleast`);
			setBranchData(response.data.branchProducts);
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
				data: productCounts,
				backgroundColor: ["#E25668", "#E28956", "#68E256", "#56E2CF", "#5668E2"],
			},
		],
	};

	const options = {
		cutoutPercentage: 50,
		animation: {
			animateRotate: true,
			render: true,
		},
		plugins: {
			title: {
				display: true,
				text: "Products Per Branch",
			},
		},
	};

	return (
		<Flex
			alignContent={"center"}
			alignItems={"center"}
			justifyItems={"center"}
			justifyContent={"center"}
			w={"500px"}
			h={"450px"}
			ml={"250px"}
		>
			<Flex w={"400px"} h={"400px"}>
				<Doughnut data={data} options={options} />
			</Flex>
		</Flex>
	);
};

export default BranchDoughnutChart;
