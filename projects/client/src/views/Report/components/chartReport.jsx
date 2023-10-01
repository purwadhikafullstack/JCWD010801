import React, { useEffect, useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import { Box, Center, Divider, FormControl, FormLabel, Grid, Select, Text } from "@chakra-ui/react";
import "chart.js/auto";
import Axios from "axios";
export const options = {
	responsive: true,
	maintainAspectRatio: false,
	plugins: {
		legend: {
			position: "top",
		},
		title: {
			display: true,
			text: "AlphaMart",
		},
	},
};

const labels = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];

function ChartReport({ roleId, branchId }) {
	const [dataReport, setDataReport] = useState(null);
	const [branches, setBranches] = useState([]);
	const [searchBranch, setSearchBranch] = useState("");
	const currentYear = new Date().getFullYear();
	const [selectedYear, setSelectedYear] = useState(currentYear.toString());
	const [monthlyTotals, setMonthlyTotals] = useState([]);
	const fetchReport = async () => {
		try {
			const response = await Axios.get(`${process.env.REACT_APP_API_BASE_URL}/report/`, {
				params: {
					searchBranch,
				},
			});

			 console.log(response);
			setDataReport(response.data);
		} catch (error) {
			console.log(error);
		}
	};
	const fetchBranch = async () => {
		try {
			const response = await Axios.get(`${process.env.REACT_APP_API_BASE_URL}/admin/branches/`);
			setBranches(response.data);
			// console.log(response);
		} catch (error) {
			console.log(error);
		}
	};
	// console.log(dataReport);
	function formatAsIDR(number) {
		return new Intl.NumberFormat("id-ID", {
			style: "currency",
			currency: "IDR",
		}).format(number);
	}
	const availableYears = dataReport ? Object.keys(dataReport.groupedResults) : [];
	availableYears.sort((a, b) => parseInt(b) - parseInt(a));
	const data = {
		labels,
		datasets: [
			{
				label: `Total by Month (${selectedYear})`,
				data: monthlyTotals,
				borderColor: "rgb(255, 99, 132)",
				backgroundColor: "rgba(255, 99, 132, 0.5)",
			},
		],
	};

	useEffect(() => {
		if (branchId) {
			setSearchBranch(branchId);
		}
		fetchReport();
		fetchBranch();
	}, [searchBranch, branchId]);
	useEffect(() => {
		if (dataReport && selectedYear) {
			const yearData = dataReport?.groupedResults[selectedYear];
			if (yearData) {
				const monthlyTotal = [];
				for (let i = 1; i <= 12; i++) {
					monthlyTotal.push(yearData.monthlyTotal[i] || 0);
				}
				setMonthlyTotals(monthlyTotal);
			} else {
				const monthlyTotal = Array(12).fill(0);
				setMonthlyTotals(monthlyTotal);
			}
		}
	}, [dataReport, selectedYear]);
console.log(searchBranch);
	return dataReport ? (
		<Center>
			<Box boxShadow={"md"} p="4" maxW={"80%"} w="100%">
				<Grid
					templateColumns={{ base: "1fr", md: "repeat(auto-fit, minmax(200px, 1fr))" }}
					gap={4}
					alignItems="center"
					justifyContent="center"
				>
					{availableYears.length > 0 && (
						<Box w={{ base: "100%", md: "auto" }}>
							<FormControl>
								<FormLabel color={"gray.500"}>Select Year</FormLabel>
								<Select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
									{availableYears.map((year) => (
										<option key={year} value={year}>
											{year}
										</option>
									))}
								</Select>
							</FormControl>
						</Box>
					)}
					{roleId === 3 ? (
						<Box w={{ base: "100%", md: "auto" }}>
							<FormControl>
								<FormLabel color={"gray.500"}>Select Branch</FormLabel>
								<Select value={searchBranch} onChange={(e) => setSearchBranch(e.target.value)} borderColor="gray.300">
									<option value="">All Branches</option>
									{branches.map((value, index) => (
										<option key={index} value={value.id}>
											{value.name}
										</option>
									))}
								</Select>
							</FormControl>
						</Box>
					) : null}
				</Grid>
				{!isNaN(dataReport.groupedResults[selectedYear]?.realTotal) && (
					<Text fontSize="xl" fontWeight="bold" mt="4">
						Total Profit for {selectedYear}:{" "}
						{formatAsIDR(dataReport.groupedResults[selectedYear]?.realTotal?.toFixed(2))}
					</Text>
				)}
				<Box
					wwidth="100%" // Make the chart container 100% of the parent width
					
					height={["auto", "300px", "700px"]} // Set different heights for different screen sizes
					margin="0 auto"
				>
					<Line options={options} data={data} />
				</Box>
			</Box>
		</Center>
	) : null;
}

export default ChartReport;
