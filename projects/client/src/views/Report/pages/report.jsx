import { Box, Button } from "@chakra-ui/react";
import ChartReport, { Test12 } from "../components/chartReport";
import TableReport from "../components/tableReport";
import { useEffect, useState, useMemo } from "react";
import Axios from "axios";
import { usePDF, Margin } from "react-to-pdf";
import TableContent from "../components/table/tableContent";
import TableReport2 from "../components/table/tableReport2";
import { useSelector } from "react-redux";

export const Report = () => {
	const [data, setData] = useState(null);

	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [searchUser, setSearchUser] = useState("");
	const [searchProduct, setSearchProduct] = useState("");
	const [search, setSearch] = useState();
	const [branches, setBranches] = useState([]);
	const [searchBranch, setSearchBranch] = useState("");
	const [sort, setSort] = useState("desc");
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(10);
	const [totalPage, setTotalPage] = useState(1);
	const reduxStore = useSelector((state) => state?.user);
	const roleId = reduxStore?.value?.RoleId
	const branchId = reduxStore?.value?.BranchId
	console.log(roleId);
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
					searchBranch,
					limit,
					sort,
					page,
				},
			});

			console.log(response);
			setData(response.data);
			setTotalPage(response.data.totalPage);
		} catch (error) {
			console.log(error);
		}
	};
	const fetchBranch = async () => {
		try {
			const response = await Axios.get(`${process.env.REACT_APP_API_BASE_URL}/admin/branches/`);
			setBranches(response.data);
			console.log(response);
		} catch (error) {
			console.log(error);
		}
	};

	console.log(startDate);
	useEffect(() => {
		fetchReport();
		fetchBranch();
	}, [startDate, endDate, searchUser, search, searchProduct, searchBranch, sort, page, limit, totalPage]);

	// pembatas disini dulu
	const columns = useMemo(
		() => [
			{
				Header: "ID",
				accessor: "id",
			},
			{
				Header: "Title",
				accessor: "title",
			},
			{
				Header: "Price",
				accessor: "price",
				isNumeric: true,
			},
		],
		[]
	);
	const initialParams = {
		pageIndex: 0,
		pageSize: 10,
		sortBy: "",
		sortAs: "asc",
	};
	const [params, setParams] = useState(initialParams);
	const [sortDirections, setSortDirections] = useState({});
	const [sortInfo, setSortInfo] = useState({
		sortBy: "",
		sortAs: "asc", // Default sorting order
	});
	const [reportData, setReportData] = useState(null);
	const [loading, setLoading] = useState(true);

	const fetchData = async (params) => {
		console.log("fetchData.fetchData::", params);
		try {
			const response = await Axios.get("https://dummyjson.com/products", {
				params: {
					_page: params.pageIndex,
					_limit: params.pageSize,
					_sort: sortInfo.sortBy,
					_order: sortInfo.sortAs,
				},
			});

			console.log("response", response);
			if (response.status === 200) {
				setReportData(response.data);
			} else {
				throw new Error("Failed to fetch report data");
			}
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		console.log("--useEffect--", params);
		fetchData(params);
	}, [params]);

	const updateParams = (paramsToUpdate) => {
		if (paramsToUpdate.sortBy) {
			// Check if the sorting direction is currently descending
			const isDescending = sortDirections[paramsToUpdate.sortBy] === "desc";

			if (paramsToUpdate.sortBy === params.sortBy) {
				// If the same column is clicked, toggle the sorting direction
				setSortDirections({
					[paramsToUpdate.sortBy]: isDescending ? "asc" : "desc",
				});

				// Toggle the sorting direction in params as well
				setParams({
					...params,
					sortAs: isDescending ? "asc" : "desc",
				});
			} else {
				// If a different column is clicked, set it to ascending
				setSortDirections({
					[paramsToUpdate.sortBy]: "asc",
				});

				// Update the sorting direction in params as well
				setParams({
					...params,
					sortBy: paramsToUpdate.sortBy,
					sortAs: "asc",
				});
			}
		} else {
			setParams((prevState) => ({
				...prevState,
				...paramsToUpdate,
			}));
		}
	};
console.log(reportData);
	return (
		<Box>
			<Box>
				<Button onClick={() => toPDF()}>Download PDF</Button>
			</Box>
			<Box ref={targetRef}>
				<ChartReport roleId={roleId} branchId={branchId}/>
				{data && branches ? (
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
						branches={branches}
						searchProduct={searchProduct}
						setSearchProduct={setSearchProduct}
						searchBranch={searchBranch}
						setSearchBranch={setSearchBranch}
						sort={sort}
						setSort={setSort}
						page={page}
						setPage={setPage}
						limit={limit}
						setLimit={setLimit}
						totalPage={totalPage}
						/>
						): null}
			</Box>
			{reportData ? (
				<TableReport2
				dataReport={data}
				havePagination={true}
				params={params}
				updateParams={updateParams}
				sort={sort}
						setSort={setSort}
						page={page}
						setPage={setPage}
						limit={limit}
						setLimit={setLimit}
						totalPage={totalPage}
				/>
			): null

			}
				
		</Box>
	);
};
