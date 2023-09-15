import Axios from "axios";
import React, { useState } from "react";
import { Flex, Checkbox, Image, Text, Switch } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { TiDelete } from "react-icons/ti";
import { ConfirmPassword } from "../../components/modal/confirmPassword";
import { EditProduct } from "../../components/modal/editProduct";

export const ProductTabPanel = ({
	id,
	data,
	isLastItem,
	isChecked,
	toggleCheckbox,
	categories,
	getCategoryLabel,
	handleActivation,
	handleDelete,
	setCheckboxState,
	initialCheckboxState,
	reload,
	setReload,
}) => {
	const navigate = useNavigate();
	const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
	const [inputPassword, setInputPassword] = useState("");
	const [validationError, setValidationError] = useState("");

	const openPasswordModal = () => {
		setIsPasswordModalOpen(true);
	};

	const closePasswordModal = () => {
		setIsPasswordModalOpen(false);
	};

	const handlePasswordConfirmation = async () => {
		try {
			const response = await Axios.post(`${process.env.REACT_APP_API_BASE_URL}/admin/${id}`, {
				password: inputPassword,
			});

			if (response.status === 200) {
				closePasswordModal();
				handleDelete(data.id);
			}
		} catch (error) {
			setValidationError(error.response.data.message);
		}
	};

	const gradientBackground = {
		background: `linear-gradient(to right, rgba(128, 8, 8, 0.5), white)`,
	};

	return (
		<Flex
			key={data.id}
			w={"1225px"}
			h={"100px"}
			align={"center"}
			bgColor={data.isDeleted && !data.isActive ? "rgba(128, 8, 8, 0.5)" : null}
			style={!data.isDeleted && !data.isActive ? gradientBackground : {}}
			color={data.isDeleted && !data.isActive ? "white" : "black"}
			borderBottom={isLastItem ? "none" : "1px solid black"}
			borderRadius={"5px"}
		>
			<Flex w={"22px"} h={"75px"} justify={"center"} align={"center"}>
				<Checkbox
					isChecked={isChecked(data.id)}
					onChange={() => toggleCheckbox(data.id)}
					isDisabled={data.isDeleted === true || data.isActive === false}
					colorScheme="green"
					iconColor="white"
					size={"lg"}
				/>
			</Flex>
			<Flex w={"75px"} h={"75px"} justify={"center"} align={"center"} ml={"3px"}>
				<Image
					src={`${process.env.REACT_APP_BASE_URL}/products/${data?.imgURL}`}
					alt={data.productName}
					cursor={"pointer"}
					onClick={() => navigate(`/product/${data.id}`)}
					boxSize="75px"
					objectFit="cover"
				/>
			</Flex>
			<Flex
				className="scrollbar-4px"
				w={"173px"}
				h={"75px"}
				justify={"left"}
				align={"center"}
				ml={"1px"}
				overflow={"auto"}
				overflowX={"hidden"}
				overflowWrap={"break-word"}
				bgColor={data.isDeleted ? "rgba(3, 3, 3, 0.8)" : "rgba(51, 50, 52, 0.2)"}
				borderRadius={"5px"}
			>
				<Text p={"3px"} onClick={() => navigate(`/product/${data.id}`)} cursor={"pointer"}>
					{data.productName}
				</Text>
			</Flex>
			<Flex
				className="scrollbar-4px"
				w={"249px"}
				h={"75px"}
				justify={"left"}
				align={"center"}
				ml={"6px"}
				overflow={"auto"}
				overflowX={"hidden"}
				overflowWrap={"break-word"}
				bgColor={data.isDeleted ? "rgba(3, 3, 3, 0.8)" : "rgba(51, 50, 52, 0.1)"}
				borderRadius={"5px"}
			>
				<Text p={"3px"}>{data.description}</Text>
			</Flex>
			<Flex
				w={"100px"}
				h={"75px"}
				justify={"center"}
				align={"center"}
				textAlign={"center"}
				ml={"5px"}
				overflow={"auto"}
				overflowWrap={"break-word"}
				bgColor={data.isDeleted ? "rgba(3, 3, 3, 0.8)" : "rgba(51, 50, 52, 0.2)"}
				borderRadius={"5px"}
			>
				<Text>Rp. {data.price.toLocaleString("id-ID")}</Text>
			</Flex>
			<Flex
				w={"85px"}
				h={"75px"}
				justify={"center"}
				align={"center"}
				textAlign={"center"}
				ml={"5px"}
				overflow={"auto"}
				overflowWrap={"break-word"}
				bgColor={data.isDeleted ? "rgba(3, 3, 3, 0.8)" : "rgba(51, 50, 52, 0.1)"}
				borderRadius={"5px"}
			>
				<Text>{(data.weight / 1000).toFixed(2)} Kg</Text>
			</Flex>
			<Flex
				w={"120px"}
				h={"75px"}
				justify={"center"}
				align={"center"}
				textAlign={"center"}
				ml={"5px"}
				overflow={"auto"}
				overflowWrap={"break-word"}
				bgColor={data.isDeleted ? "rgba(3, 3, 3, 0.8)" : "rgba(51, 50, 52, 0.2)"}
				borderRadius={"5px"}
			>
				<Text>{getCategoryLabel(data.CategoryId)}</Text>
			</Flex>
			<Flex
				w={"109px"}
				h={"75px"}
				justify={"center"}
				align={"center"}
				textAlign={"center"}
				ml={"5px"}
				overflow={"auto"}
				overflowWrap={"break-word"}
				bgColor={data.isDeleted ? "rgba(3, 3, 3, 0.8)" : "rgba(51, 50, 52, 0.1)"}
				borderRadius={"5px"}
			>
				<Text>{data.aggregateStock} Units</Text>
			</Flex>
			<Flex
				w={"109px"}
				h={"75px"}
				justify={"center"}
				align={"center"}
				textAlign={"center"}
				ml={"8px"}
				overflow={"auto"}
				overflowWrap={"break-word"}
				bgColor={data.isDeleted ? "rgba(3, 3, 3, 0.8)" : "rgba(51, 50, 52, 0.2)"}
				borderRadius={"5px"}
			>
				<Text>{data.aggregateStock} Units</Text>
			</Flex>
			<Flex w={"64px"} h={"75px"} justify={"center"} align={"center"} ml={"5px"}>
				<Switch
					size="lg"
					isChecked={data.isActive && !data.isDeleted}
					onChange={() => {
						handleActivation(data.id);
						setCheckboxState(initialCheckboxState);
					}}
					isDisabled={data.isDeleted === true}
				/>
			</Flex>
			<Flex w={"71px"} h={"75px"} justify={"space-around"} align={"center"} ml={"5px"}>
				<EditProduct
					PID={data.id}
					productName={data.productName}
					price={data.price}
					description={data.description}
					categories={categories}
					CategoryId={data.CategoryId}
					getCategoryLabel={getCategoryLabel}
					weight={data.weight}
					image={data.imgURL}
					isActive={data.isActive}
					isDeleted={data.isDeleted}
					reload={reload}
					setReload={setReload}
				/>
				<TiDelete
					size={40}
					cursor={data.isDeleted ? "not-allowed" : "pointer"}
					color={data.isDeleted ? "rgba(3, 3, 3, 0.8)" : "#B90E0A"}
					onClick={() => {
						if (!data.isDeleted) {
							openPasswordModal();
						}
					}}
				/>
				<ConfirmPassword
					isOpen={isPasswordModalOpen}
					onClose={closePasswordModal}
					inputPassword={inputPassword}
					setInputPassword={setInputPassword}
					onConfirm={handlePasswordConfirmation}
					validationError={validationError}
					setValidationError={setValidationError}
				/>
			</Flex>
		</Flex>
	);
};
