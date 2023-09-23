import axios from "axios";
import React, { useEffect, useState } from "react";
import { Flex } from "@chakra-ui/react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
ChartJS.register(ArcElement, Tooltip, Legend);

const CategoryDoughnutChart = () => {
	const [categoryData, setCategoryData] = useState([]);

	const fetchData = async () => {
		try {
			const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/product-report/categories/mostandleast`);
			setCategoryData(response.data.result);
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
				data: categoryData.map((category) => category.productCount),
				backgroundColor: [
					"#8A56E2",
					"#CF56E2",
					"#E256AE",
					"#E25668",
					"#E28956",
					"#E2CF56",
					"#AEE256",
					"#68E256",
					"#56E289",
					"#56E2CF",
					"#56AEE2",
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
            text: 'Products Per Category',
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

export default CategoryDoughnutChart;
