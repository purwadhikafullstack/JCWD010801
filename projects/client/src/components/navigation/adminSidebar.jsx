import "react-toastify/dist/ReactToastify.css";
import source from "../../assets/public/AM_logo_white.png";
import sourceLogo from "../../assets/public/AM_logo_only_white_trans.png";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Box, Flex, IconButton, Image, Text } from "@chakra-ui/react";
import { toast } from "react-toastify";
import { FaBars } from "react-icons/fa";
import { SlLogout } from "react-icons/sl";
import { LiaBoxSolid } from "react-icons/lia";
import { VscGraphLine } from "react-icons/vsc";
import { RiDashboardLine, RiFileList3Line } from "react-icons/ri";
import { BsPersonGear } from "react-icons/bs";
import { AiOutlineBranches, AiOutlineHome } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { setValue } from "../../redux/userSlice";
import { sidebarEvent } from "../../events/sidebarEvent";

export const AdminSidebar = ({ height, navSizeProp, navPosProp }) => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const user = useSelector((state) => state?.user?.value);
	const [isTextVisible, setIsTextVisible] = useState(true);
	const [navSize, setNavsize] = useState(navSizeProp || "large");

	const logout = () => {
		localStorage.removeItem("token");
		toast.success("You have successfully logged out.", {
			position: "top-right",
			autoClose: 4000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
			theme: "dark",
		});
		dispatch(setValue({}));
		navigate("/login");
	};

	const toggleNavSize = () => {
		setNavsize(navSize === "small" ? "large" : "small");
	};

	useEffect(() => {
		sidebarEvent.emit("sidebarSizeChange", navSize);

		const timer = setTimeout(() => {
			setIsTextVisible(navSize === "large");
		}, 2000);
		return () => clearTimeout(timer);
	}, [navSize]);

	return (
		<>
			<Flex
				position={navPosProp || null}
				w={navSize === "small" ? "100px" : "170px"}
				transition="all 3s ease-in-out"
				minH={height || "100vh"}
				backgroundColor={"black"}
				borderTopRightRadius={"30px"}
				boxShadow="0px 0px 8px black"
				justifyContent={"space-between"}
				direction={"column"}
			>
				<Flex mt={"10px"} direction={"column"}>
					<Flex justifyContent={"center"} cursor={"pointer"} onClick={toggleNavSize}>
						<Image
							w={navSize === "small" ? "60px" : "120px"}
							mr={navSize === "small" ? "10px" : "15px"}
							src={navSize === "small" ? sourceLogo : source}
							transition="transform 2s ease-in-out"
							_hover={{ transform: "scale(1.1)" }}
						/>
					</Flex>
					<Flex
						onClick={toggleNavSize}
						_hover={{ transform: "scale(1.1)" }}
						transition="transform 0.5s ease-in-out"
						ml={navSize === "large" ? "22px" : "2px"}
						justifyContent={navSize === "large" ? "start" : "center"}
					>
						<IconButton mb={"7px"} variant={"unstyled"} icon={<FaBars size={25} />} color={"white"} />
						{navSize === "large" ? (
							<Text
								className={isTextVisible ? "text-visible" : "text-invisible"}
								cursor={"pointer"}
								color={"white"}
								mr={"10px"}
								mt={"7px"}
								fontSize={"16px"}
							>
								View Less
							</Text>
						) : null}
					</Flex>
					<Flex
						as={Link}
						to={"/dashboard"}
						_hover={{ transform: "scale(1.1)" }}
						transition="transform 0.5s ease-in-out"
						ml={navSize === "large" ? "20px" : "0px"}
						justifyContent={navSize === "large" ? "start" : "center"}
					>
						<IconButton color={"white"} variant={"unstyled"} icon={<RiDashboardLine size={28} />} />
						{navSize === "large" ? (
							<Text
								className={isTextVisible ? "text-visible" : "text-invisible"}
								cursor={"pointer"}
								color={"white"}
								mr={"13px"}
								mt={"7px"}
								fontSize={"16px"}
							>
								Dashboard
							</Text>
						) : null}
					</Flex>
				</Flex>
				<Box>
					<Flex
						as={Link}
						to={"/"}
						mb={"20px"}
						color={"white"}
						transition="transform 0.5s ease-in-out"
						_hover={{ transform: "scale(1.2)" }}
						ml={navSize === "large" ? "18px" : "0px"}
						mr={navSize === "large" ? "0px" : "3px"}
						justifyContent={navSize === "large" ? "start" : "center"}
					>
						<AiOutlineHome size={30} />
						{navSize === "large" ? (
							<Text
								className={isTextVisible ? "text-visible" : "text-invisible"}
								cursor={"pointer"}
								color={"white"}
								ml={"11px"}
								mt={"2px"}
								fontSize={"16px"}
							>
								Home
							</Text>
						) : null}
					</Flex>
					<Flex
						as={Link}
						to={"/dashboard/product-management"}
						mb={"20px"}
						color={"white"}
						transition="transform 0.5s ease-in-out"
						_hover={{ transform: "scale(1.2)" }}
						ml={navSize === "large" ? "18px" : "0px"}
						mr={navSize === "large" ? "0px" : "3px"}
						justifyContent={navSize === "large" ? "start" : "center"}
					>
						<LiaBoxSolid size={30} />
						{navSize === "large" ? (
							<Text
								className={isTextVisible ? "text-visible" : "text-invisible"}
								cursor={"pointer"}
								color={"white"}
								ml={"11px"}
								mt={"2px"}
								fontSize={"16px"}
							>
								Products
							</Text>
						) : null}
					</Flex>
					{/* <Flex
						as={Link}
						to={"/dashboard/product-management"}
						mb={"20px"}
						color={"white"}
						transition="transform 0.5s ease-in-out"
						_hover={{ transform: "scale(1.2)" }}
						ml={navSize === "large" ? "18px" : "0px"}
						mr={navSize === "large" ? "0px" : "3px"}
						justifyContent={navSize === "large" ? "start" : "center"}
					>
						<BsPersonCircle size={30} />
						{navSize === "large" ? (
							<Text
								className={isTextVisible ? "text-visible" : "text-invisible"}
								cursor={"pointer"}
								color={"white"}
								ml={"11px"}
								mt={"2px"}
								fontSize={"16px"}
							>
								Profile
							</Text>
						) : null}
					</Flex> */}
					<Flex
						as={Link}
						to={"/dashboard/orders-list"}
						mb={"20px"}
						color={"white"}
						transition="transform 0.5s ease-in-out"
						_hover={{ transform: "scale(1.2)" }}
						ml={navSize === "large" ? "20px" : "0px"}
						justifyContent={navSize === "large" ? "start" : "center"}
					>
						<RiFileList3Line size={30} />
						{navSize === "large" ? (
							<Text
								className={isTextVisible ? "text-visible" : "text-invisible"}
								cursor={"pointer"}
								color={"white"}
								ml={"11px"}
								mt={"2px"}
								fontSize={"16px"}
							>
								Orders
							</Text>
						) : null}
					</Flex>
					<Flex
						as={Link}
						to={"/dashboard"}
						mb={"20px"}
						color={"white"}
						transition="transform 0.5s ease-in-out"
						_hover={{ transform: "scale(1.2)" }}
						ml={navSize === "large" ? "20px" : "0px"}
						justifyContent={navSize === "large" ? "start" : "center"}
					>
						<AiOutlineBranches size={30} />
						{navSize === "large" ? (
							<Text
								className={isTextVisible ? "text-visible" : "text-invisible"}
								cursor={"pointer"}
								color={"white"}
								ml={"11px"}
								mt={"2px"}
								fontSize={"16px"}
							>
								Sales
							</Text>
						) : null}
					</Flex>
					<Flex
						as={Link}
						to={"/dashboard/report/overview"}
						mb={"20px"}
						color={"white"}
						transition="transform 0.5s ease-in-out"
						_hover={{ transform: "scale(1.2)" }}
						ml={navSize === "large" ? "24px" : "0px"}
						justifyContent={navSize === "large" ? "start" : "center"}
					>
						<VscGraphLine size={27} />
						{navSize === "large" ? (
							<Text
								className={isTextVisible ? "text-visible" : "text-invisible"}
								cursor={"pointer"}
								color={"white"}
								ml={"12px"}
								mt={"2px"}
								fontSize={"16px"}
							>
								Report
							</Text>
						) : null}
					</Flex>
					{user.RoleId === 3 ? (
						<Flex
							as={Link}
							to={"/dashboard/admins-list"}
							mb={"20px"}
							color={"white"}
							transition="transform 0.5s ease-in-out"
							_hover={{ transform: "scale(1.1)" }}
							ml={navSize === "large" ? "20px" : "0px"}
							mt={navSize === "large" ? "20px" : "0px"}
							justifyContent={navSize === "large" ? "start" : "center"}
						>
							<Box mt={navSize === "large" ? "8px" : "0px"}>
								<BsPersonGear size={32} />
							</Box>
							{navSize === "large" ? (
								<Box>
									<Text
										className={isTextVisible ? "text-visible" : "text-invisible"}
										align={"left"}
										cursor={"pointer"}
										color={"white"}
										mt={"4px"}
										ml={"12px"}
										fontSize={"13px"}
									>
										Admin
									</Text>
									<Text
										className={isTextVisible ? "text-visible" : "text-invisible"}
										cursor={"pointer"}
										color={"white"}
										ml={"12px"}
										fontSize={"13px"}
									>
										Management
									</Text>
								</Box>
							) : null}
						</Flex>
					) : null}
				</Box>
				<Flex
					onClick={logout}
					mb={"20px"}
					justifyContent={"center"}
					color={"white"}
					transition="transform 0.5s ease-in-out"
					_hover={{ transform: "scale(1.1)" }}
				>
					<SlLogout size={25} cursor={"pointer"} />
					{navSize === "large" ? (
						<Text
							className={isTextVisible ? "text-visible" : "text-invisible"}
							cursor={"pointer"}
							color={"white"}
							ml={"11px"}
							mt={"2px"}
							fontSize={"16px"}
						>
							Logout
						</Text>
					) : null}
				</Flex>
			</Flex>
		</>
	);
};
