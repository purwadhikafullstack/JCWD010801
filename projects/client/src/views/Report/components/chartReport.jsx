import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Box, Center, Divider, Select, Text } from "@chakra-ui/react";
import "chart.js/auto"
export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Chart.js Line Chart",
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

function ChartReport({ dataReport }) {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [monthlyTotals, setMonthlyTotals] = useState([]);
console.log(dataReport);
function formatAsIDR(number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(number);
}
  useEffect(() => {
    if (dataReport && selectedYear) {
      const yearData = dataReport.groupedResults[selectedYear];
      if (yearData) {
        const monthlyTotal = [];
        for (let i = 1; i <= 12; i++) {
          monthlyTotal.push(yearData.monthlyTotal[i] || 0);
        }

        setMonthlyTotals(monthlyTotal);
      }
    }
  }, [dataReport, selectedYear]);
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

  return (
    <Center>
      <Box border={"2px"} p="4" maxW={"80%"} w="100%">
        <Select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          {availableYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </Select>
        <Text fontSize="xl" fontWeight="bold" mt="4">
          Total Profit for {selectedYear}:{" "}
          {formatAsIDR(
            dataReport.groupedResults[selectedYear]?.realTotal?.toFixed(2)
          )}
        </Text>
        <Line options={options} data={data} />
      </Box>
    </Center>
  );
}

export default ChartReport;
