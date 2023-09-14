import source from "../../assets/public/AM_logo_white.png";
import sourceLogo from "../../assets/public/AM_logo_only_white_trans.png";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Box, Flex, IconButton, Image, Text } from "@chakra-ui/react";
import { toast } from "react-toastify";
import { FaBars } from "react-icons/fa";
import { SlLogout } from "react-icons/sl";
import { LiaBoxSolid } from "react-icons/lia";
import { VscGraphLine } from "react-icons/vsc";
import { RiFileList3Line } from "react-icons/ri";
import { BsPersonGear } from "react-icons/bs";
import { AiOutlineBranches, AiOutlineHome } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { setValue } from "../../redux/userSlice";

export const AdminSidebar = ({ height, navSizeProp }) => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const user = useSelector((state) => state.user.value);
	const [navSize, setNavsize] = useState(navSizeProp || "small");
	const logout = () => {
		localStorage.removeItem("token");
		toast.error("You have successfully logged out.", {
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
	return (
		<Flex
			position={"fixed"}
			w={navSize === "small" ? "100px" : "170px"}
			transition="width 0.3s"
			h={height || "100vh"}
			backgroundColor={"black"}
			borderTopRightRadius={"30px"}
			boxShadow="0px 0px 8px black"
			justifyContent={"space-between"}
			direction={"column"}
		>
			<Flex mt={"10px"} direction={"column"}>
				<Flex justifyContent={"center"} as={Link} to={"/"}>
					<Image
						w={navSize === "small" ? "60px" : "120px"}
						mr={navSize === "small" ? "0px" : "15px"}
						src={navSize === "small" ? sourceLogo : source}
						transition="transform 0.3s ease-in-out"
						_hover={{ transform: "scale(1.1)" }}
					/>
				</Flex>
				<Flex
					onClick={toggleNavSize}
					_hover={{ transform: "scale(1.1)" }}
					transition="transform 0.3s ease-in-out"
					justifyContent={"center"}
				>
					<IconButton
						mb={"15px"}
						variant={"unstyled"}
						icon={<FaBars size={25} />}
						color={"white"}
						ml={navSize === "large" ? "0px" : "15px"}
						justifyContent={navSize === "large" ? "start" : "center"}
					/>
					{navSize === "large" ? (
						<Text cursor={"pointer"} color={"white"} mr={"10px"} mt={"7px"} fontSize={"16px"}>
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
					transition="transform 0.3s ease-in-out"
					_hover={{ transform: "scale(1.2)" }}
					ml={navSize === "large" ? "20px" : "0px"}
					justifyContent={navSize === "large" ? "start" : "center"}
				>
					<AiOutlineHome size={30} />
					{navSize === "large" ? (
						<Text cursor={"pointer"} color={"white"} ml={"11px"} mt={"2px"} fontSize={"16px"}>
							Home
						</Text>
					) : null}
				</Flex>
				<Flex
					as={Link}
					to={"/dashboard"}
					mb={"20px"}
					color={"white"}
					transition="transform 0.3s ease-in-out"
					_hover={{ transform: "scale(1.2)" }}
					ml={navSize === "large" ? "20px" : "0px"}
					justifyContent={navSize === "large" ? "start" : "center"}
				>
					<LiaBoxSolid size={30} />
					{navSize === "large" ? (
						<Text cursor={"pointer"} color={"white"} ml={"11px"} mt={"2px"} fontSize={"16px"}>
							Products
						</Text>
					) : null}
				</Flex>
				<Flex
					as={Link}
					to={"/dashboard"}
					mb={"20px"}
					color={"white"}
					transition="transform 0.3s ease-in-out"
					_hover={{ transform: "scale(1.2)" }}
					ml={navSize === "large" ? "20px" : "0px"}
					justifyContent={navSize === "large" ? "start" : "center"}
				>
					<RiFileList3Line size={30} />
					{navSize === "large" ? (
						<Text cursor={"pointer"} color={"white"} ml={"11px"} mt={"2px"} fontSize={"16px"}>
							Orders
						</Text>
					) : null}
				</Flex>
				<Flex
					as={Link}
					to={"/dashboard"}
					mb={"20px"}
					color={"white"}
					transition="transform 0.3s ease-in-out"
					_hover={{ transform: "scale(1.2)" }}
					ml={navSize === "large" ? "20px" : "0px"}
					justifyContent={navSize === "large" ? "start" : "center"}
				>
					<AiOutlineBranches size={30} />
					{navSize === "large" ? (
						<Text cursor={"pointer"} color={"white"} ml={"11px"} mt={"2px"} fontSize={"16px"}>
							Branches
						</Text>
					) : null}
				</Flex>
				<Flex
					as={Link}
					to={"/dashboard"}
					mb={"20px"}
					color={"white"}
					transition="transform 0.3s ease-in-out"
					_hover={{ transform: "scale(1.2)" }}
					ml={navSize === "large" ? "24px" : "0px"}
					justifyContent={navSize === "large" ? "start" : "center"}
				>
					<VscGraphLine size={27} />
					{navSize === "large" ? (
						<Text cursor={"pointer"} color={"white"} ml={"12px"} mt={"2px"} fontSize={"16px"}>
							Report
						</Text>
					) : null}
				</Flex>
				{user.RoleId === 3 ? (
					<Flex
						as={Link}
						to={"/dashboard/adminslist"}
						mb={"20px"}
						color={"white"}
						transition="transform 0.3s ease-in-out"
						_hover={{ transform: "scale(1.1)" }}
						ml={navSize === "large" ? "20px" : "0px"}
						mt={navSize === "large" ? "20px" : "0px"}
						justifyContent={navSize === "large" ? "start" : "center"}
					>
						<Box mt={navSize === "large" ? "8px" : "0px"}>
							<BsPersonGear size={32} />
						</Box>
						{navSize === "large" ? (
							<Text cursor={"pointer"} color={"white"} ml={"12px"} fontSize={"16px"}>
								Admin Management
							</Text>
						) : null}
					</Flex>
				) : null}
			</Box>
			<Flex onClick={logout} mb={"20px"} justifyContent={"center"} color={"white"}>
				<SlLogout size={25} />
				{navSize === "large" ? (
					<Text cursor={"pointer"} color={"white"} ml={"11px"} mt={"2px"} fontSize={"16px"}>
						Logout
					</Text>
				) : null}
			</Flex>
		</Flex>
	);
};
