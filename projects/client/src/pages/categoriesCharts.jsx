import React from "react";
import CategoryBarChart from "../components/stockReport/categoryBarChart";
import CategoryDoughnutChart from "../components/stockReport/categoryDoughnutChart";
import ActiveProductsBarChart from "../components/stockReport/activeProductsBarChart";
import DeactivatedProductsBarChart from "../components/stockReport/deactivatedProductsBarChart";
import DeletedProductsBarChart from "../components/stockReport/deletedProductsBarChart";
import ViewCountBarChart from "../components/stockReport/viewCountBarChart";
import { Stack } from "@chakra-ui/react";

const categoriesCharts = () => {
	return (
		<Stack align={"center"} w={"99vw"} h={"300vh"}>
			<CategoryDoughnutChart />
			<CategoryBarChart />
			<ViewCountBarChart />
			<ActiveProductsBarChart />
			<DeactivatedProductsBarChart />
			<DeletedProductsBarChart />
		</Stack>
	);
};

export default categoriesCharts;
