import { Box, Button } from "@chakra-ui/react";
import ChartReport, { Test12 } from "./chartReport";
import TableReport from "./tableReport";
import { useEffect, useState } from "react";
import Axios from "axios";
import { usePDF, Margin } from "react-to-pdf";

export const Report = () => {
	const [data, setData] = useState(null);

	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [searchUser, setSearchUser] = useState("");
	const [searchProduct, setSearchProduct] = useState("");
	const [search, setSearch] = useState();
	const { toPDF, targetRef } = usePDF({ filename: "page.pdf", page: { margin: Margin.MEDIUM } });
	const fetchReport = async () => {
		try {
			const response = await Axios.get(`${process.env.REACT_APP_API_BASE_URL}/report/`, {
				params: {
					startDate,
					endDate,
					searchUser,
					search,
					searchProduct,
				},
			});

			console.log(response);
			setData(response.data);
		} catch (error) {
			console.log(error);
		}
	};
	console.log(startDate);
	useEffect(() => {
		fetchReport();
	}, [startDate, endDate, searchUser, search, searchProduct]);
	return (
		<Box>
			<Box>
				<Button onClick={() => toPDF()}>Download PDF</Button>
			</Box>
			{!data ? null : (
				<Box ref={targetRef}>
					<ChartReport dataReport={data} />
					<TableReport
						dataReport={data}
						startDate={startDate}
						setStartDate={setStartDate}
						endDate={endDate}
						setEndDate={setEndDate}
						searchUser={searchUser}
						setSearchUser={setSearchUser}
						search={search}
						setSearch={setSearch}
						searchProduct={searchProduct}
						setSearchProduct={setSearchProduct}
					/>
				</Box>
			)}
		</Box>
	);
};
