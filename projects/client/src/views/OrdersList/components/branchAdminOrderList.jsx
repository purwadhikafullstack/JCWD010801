import Axios from "axios";
import { useEffect, useState } from "react";
import { Tabs, TabList, TabPanels, Tab, TabPanel, TabIndicator, Flex, Box, Text } from "@chakra-ui/react";
import { AdminSidebar } from "../../../components/navigation/adminSidebar";
import { NavbarAdmin } from "../../../components/navigation/navbarAdmin";
import { WaitingOrders } from "./branchOrder/waiting";
import { ProcessingOrders } from "./branchOrder/processing";
import { PendingOrders } from "./branchOrder/pending";
import { SentOrders } from "./branchOrder/sent";
import { ConfirmedOrders } from "./branchOrder/received";
import { CanceledOrders } from "./branchOrder/cancelByAdmin";
import { AllOrders } from "./branchOrder/allOrders";

export const BranchAdminOrdersList = () => {
	const [totalOrders, setTotalOrders] = useState("");
	const [waitingOrders, setWaitingOrders] = useState("");
	const [pendingOrders, setPendingOrders] = useState("");
	const [processingOrders, setProcessingOrders] = useState("");
	const [sentOrders, setSentOrders] = useState("");
	const [receivedOrders, setReceivedOrders] = useState("");
	const [cancelledOrders, setCancelledOrders] = useState("");
	const [reload, setReload] = useState(false);
	const token = localStorage.getItem("token");
	const headers = {
		Authorization: `Bearer ${token}`,
	};
	const ordersList = async () => {
		try {
			const response = await Axios.get(`${process.env.REACT_APP_API_BASE_URL}/order/branchadmin`, {
				headers,
			});
			setTotalOrders(response.data.countOrders);
			setWaitingOrders(response.data.waitingOrders);
			setPendingOrders(response.data.pendingOrders);
			setProcessingOrders(response.data.processingOrders);
			setSentOrders(response.data.sentOrders);
			setReceivedOrders(response.data.receivedOrders);
			setCancelledOrders(response.data.cancelledOrders);
			setReload(true);
		} catch (error) {
			console.log(error);
		}
	};
	useEffect(() => {
		ordersList();
	}, [reload]);
	return (
		<Flex>
			<AdminSidebar />
			<Box w={"full"}>
				<NavbarAdmin />
				<Box w={"full"}>
					<Tabs align="center" position="relative" variant="unstyled">
						<TabList>
							<Tab>
								<Flex>
									All orders
									{totalOrders > 0 && (
										<Flex
											w={5}
											h={5}
											ml={"60px"}
											bg={"blackAlpha.600"}
											border={"2px solid white"}
											rounded={"full"}
											justifyContent={"center"}
											alignItems={"center"}
											pos={"absolute"}
											top={1}
										>
											<Text fontSize={"10px"} color={"white"} textAlign={"center"}>
												{totalOrders}
											</Text>
										</Flex>
									)}
								</Flex>
							</Tab>
							<Tab>
								<Flex>
									Waiting for Payment
									{waitingOrders > 0 && (
										<Flex
											w={5}
											h={5}
											ml={"140px"}
											bg={"blackAlpha.600"}
											border={"2px solid white"}
											rounded={"full"}
											justifyContent={"center"}
											alignItems={"center"}
											pos={"absolute"}
											top={1}
										>
											<Text fontSize={"10px"} color={"white"} textAlign={"center"}>
												{waitingOrders}
											</Text>
										</Flex>
									)}
								</Flex>
							</Tab>
							<Tab>
								<Flex>
									Pending payment confirmation
									{pendingOrders > 0 && (
										<Flex
											w={5}
											h={5}
											ml={"212px"}
											bg={"blackAlpha.600"}
											border={"2px solid white"}
											rounded={"full"}
											justifyContent={"center"}
											alignItems={"center"}
											pos={"absolute"}
											top={1}
										>
											<Text fontSize={"10px"} color={"white"} textAlign={"center"}>
												{pendingOrders}
											</Text>
										</Flex>
									)}
								</Flex>
							</Tab>
							<Tab>
								<Flex>
									Processing
									{processingOrders > 0 && (
										<Flex
											w={5}
											h={5}
											ml={"68px"}
											bg={"blackAlpha.600"}
											border={"2px solid white"}
											rounded={"full"}
											justifyContent={"center"}
											alignItems={"center"}
											pos={"absolute"}
											top={1}
										>
											<Text fontSize={"10px"} color={"white"} textAlign={"center"}>
												{processingOrders}
											</Text>
										</Flex>
									)}
								</Flex>
							</Tab>
							<Tab>
								<Flex>
									Sent
									{sentOrders > 0 && (
										<Flex
											w={5}
											h={5}
											ml={"26px"}
											bg={"blackAlpha.600"}
											border={"2px solid white"}
											rounded={"full"}
											justifyContent={"center"}
											alignItems={"center"}
											pos={"absolute"}
											top={1}
										>
											<Text fontSize={"10px"} color={"white"} textAlign={"center"}>
												{sentOrders}
											</Text>
										</Flex>
									)}
								</Flex>
							</Tab>
							<Tab>
								<Flex>
									Received
									{receivedOrders > 0 && (
										<Flex
											w={5}
											h={5}
											ml={"58px"}
											bg={"blackAlpha.600"}
											border={"2px solid white"}
											rounded={"full"}
											justifyContent={"center"}
											alignItems={"center"}
											pos={"absolute"}
											top={1}
										>
											<Text fontSize={"10px"} color={"white"} textAlign={"center"}>
												{receivedOrders}
											</Text>
										</Flex>
									)}
								</Flex>
							</Tab>
							<Tab>
								<Flex>
									Cancelled
									{cancelledOrders > 0 && (
										<Flex
											w={5}
											h={5}
											ml={"63px"}
											bg={"blackAlpha.600"}
											border={"2px solid white"}
											rounded={"full"}
											justifyContent={"center"}
											alignItems={"center"}
											pos={"absolute"}
											top={1}
										>
											<Text fontSize={"10px"} color={"white"} textAlign={"center"}>
												{cancelledOrders}
											</Text>
										</Flex>
									)}
								</Flex>
							</Tab>
						</TabList>
						<TabIndicator mt="-1.5px" height="2px" bg="black" borderRadius="1px" />
						<TabPanels>
							<TabPanel>
								<AllOrders reload={reload} setReload={setReload} />
							</TabPanel>
							<TabPanel>
								<WaitingOrders reload={reload} setReload={setReload} />
							</TabPanel>
							<TabPanel>
								<PendingOrders reload={reload} setReload={setReload} />
							</TabPanel>
							<TabPanel>
								<ProcessingOrders reload={reload} setReload={setReload} />
							</TabPanel>
							<TabPanel>
								<SentOrders reload={reload} setReload={setReload} />
							</TabPanel>
							<TabPanel>
								<ConfirmedOrders reload={reload} setReload={setReload} />
							</TabPanel>
							<TabPanel>
								<CanceledOrders reload={reload} setReload={setReload} />
							</TabPanel>
						</TabPanels>
					</Tabs>
				</Box>
			</Box>
		</Flex>
	);
};
