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
			setBranchData(response.data.result);
		} catch (error) {
			console.log("Error fetching data:", error);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	const data = {
		labels: branchData.map((branch) => branch.branch),
		datasets: [
			{
				data: branchData.map((branch) => branch.productCount),
				backgroundColor: [
					"#E25668",
					"#E28956",
					"#68E256",
					"#56E2CF",
					"#5668E2",
				],
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
            text: 'Products Per Branch',
          },
        },
      };

	return (
		<Flex alignContent={"center"} alignItems={'center'} justifyItems={"center"} justifyContent={'center'} w={"500px"} h={"450px"}>
			<Flex w={"400px"} h={"400px"}>
				<Doughnut data={data} options={options} />
			</Flex>
		</Flex>
	);
};

export default BranchDoughnutChart;
