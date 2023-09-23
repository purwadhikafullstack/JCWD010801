import React, { useState, useEffect, useRef } from "react";
import Axios from "axios";
import { Box, Center, Text } from "@chakra-ui/react";
import { Doughnut } from "react-chartjs-2";

const CategoryDoughnutChart = () => {
	const chartInstanceRef = useRef(null);
	const [categoryData, setCategoryData] = useState([]);

	useEffect(() => {
		Axios.get(`${process.env.REACT_APP_API_BASE_URL}/product-report/categories/mostandleast`)
			.then((response) => {
                console.log(response);
				setCategoryData(response.data.result);
			})
			.catch((error) => {
                console.error("Error fetching data:", error);
				console.error(error);
			});
	}, []);

    console.log(categoryData);

   

	// useEffect(() => {
	// 	if (categoryData.length > 0) {
	// 		if (chartInstanceRef.current) {
	// 			chartInstanceRef.current.destroy();
	// 		}

	// 		const ctx = document.getElementById("categoryDoughnutChart").getContext("2d");

	// 		const chartData = {
	// 			labels: categoryData.map((category) => category.category),
	// 			datasets: [
	// 				{
	// 					data: categoryData.map((category) => category.productCount),
	// 					backgroundColor: ["#FF5733", "#FFBD33", "#33FF57", "#33D1FF", "#9933FF"],
	// 				},
	// 			],
	// 		};

	// 		const chartOptions = {
	// 			tooltips: {
	// 				callbacks: {
	// 					label: (tooltipItem, data) => {
	// 						const categoryIndex = tooltipItem.index;
	// 						const category = categoryData[categoryIndex];

	// 						return `
    //           ${category.category}
    //           Products: ${category.productCount}
    //           Top Aggregate Stock:
    //           ${category.products.topAggregateStock
	// 							.map((product) => `${product.productName}: ${product.aggregateStock}`)
	// 							.join("\n")}
    //           Low Aggregate Stock:
    //           ${category.products.lowAggregateStock
	// 							.map((product) => `${product.productName}: ${product.aggregateStock}`)
	// 							.join("\n")}
    //           Top Views:
    //           ${category.products.topViews.map((product) => `${product.productName}: ${product.viewCount}`).join("\n")}
    //           Low Views:
    //           ${category.products.lowViews.map((product) => `${product.productName}: ${product.viewCount}`).join("\n")}
    //           `;
	// 					},
	// 				},
	// 			},
	// 		};

	// 		chartInstanceRef.current = new Doughnut(ctx, {
	// 			type: "doughnut",
	// 			data: chartData,
	// 			options: chartOptions,
	// 		});
	// 	}
	// }, [categoryData]);

	// useEffect(() => {
	// 	return () => {
	// 		if (chartInstanceRef.current) {
	// 			chartInstanceRef.current.destroy();
	// 		}
	// 	};
	// }, []);

	return (
		<Box>
			<Center>
				<Text fontSize="xl" fontWeight="bold">
					Category Doughnut Chart
				</Text>
			</Center>
            {categoryData ? <Doughnut id="categoryDoughnutChart" /> : "Loading"}
			
		</Box>
	);
};

export default CategoryDoughnutChart;
