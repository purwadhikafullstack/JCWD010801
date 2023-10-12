import { Box, Center, Flex, Heading } from "@chakra-ui/react";
import ChartReport from "../components/chartReport";
import { useEffect, useState } from "react";
import Axios from "axios";
import TableReport from "../components/table/tableReport";
import { useSelector } from "react-redux";
import TableFilter from "../components/table/tableFilter";
import { AdminSidebar } from "../../../components/navigation/adminSidebar";
import LayoutSidebar from "../../../pages/layoutSidebar";

export const Report = () => {
	const [data, setData] = useState(null);
	const [branches, setBranches] = useState([]);
	const [totalPage, setTotalPage] = useState(1);
	const reduxStore = useSelector((state) => state?.user);
	const roleId = reduxStore?.value?.RoleId;
	const branchId = reduxStore?.value?.BranchId;
	const token = localStorage.getItem("token");
	
	const initialQueryObj = {
		page: 0,
		limit: 10,
		sort: "desc",
		search: "",
		startDate: "",
		endDate: "",
		searchUser: "",
		searchProduct: "",
		searchBranch: "",
	};
	const [queryObj, setQueryObj] = useState(initialQueryObj);

	const fetchReport = async (query) => {
		try {
			const response = await Axios.get(
				`${process.env.REACT_APP_API_BASE_URL}/report?search=${query.search}&startDate=${query.startDate}&endDate=${
					query.endDate
				}&sort=${query.sort}&limit=${query.limit}&searchUser=${query.searchUser}&page=${query.page + 1}&searchProduct=${
					query.searchProduct
				}&searchBranch=${query.searchBranch}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			setData(response.data);
			setTotalPage(response.data.totalPage);
		} catch (error) {}
	};

	const fetchBranch = async () => {
		try {
			const response = await Axios.get(`${process.env.REACT_APP_API_BASE_URL}/admin/branches/`);
			setBranches(response.data);
		} catch (error) {}
	};

	useEffect(() => {
		fetchReport(queryObj);
		if (branchId && queryObj.searchBranch !== branchId) {
			setQueryObj({ ...queryObj, searchBranch: branchId });
		}
	}, [queryObj, branchId]);

	useEffect(() => {
		fetchBranch();
	}, []);

	const updateQueryObj = (queryObjToUpdate) => {
		setQueryObj((prevState) => ({
			...prevState,
			...queryObjToUpdate,
		}));
	};

	return (
		<Box>
			<Flex display={["block", "block", "flex", "flex"]}>
				<Flex>
				<LayoutSidebar height={"full"}/>
				</Flex>
				<Box w={"full"}>
					<Box>
						<Center>
							<Heading size="lg">Sales Report</Heading>
						</Center>
					</Box>
					<Box>
						<ChartReport roleId={roleId} branchId={branchId} />
						{data && branches ? (
							<Box mt={"4"}>
								<TableFilter queryObj={queryObj} setQueryObj={setQueryObj} branches={branches} branchId={branchId} />
								<TableReport
									dataReport={data}
									havePagination={true}
									queryObj={queryObj}
									updateQueryObj={updateQueryObj}
									totalPage={totalPage}
									branchId={branchId}
								/>
							</Box>
						) : null}
					</Box>
				</Box>
			</Flex>
		</Box>
	);
};
