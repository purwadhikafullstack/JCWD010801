import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "swiper/css/autoplay";
import Axios from "axios";
import styled from "styled-components";
import { Navigation, Scrollbar, A11y, Pagination, Autoplay } from "swiper/modules";
import { Badge, Box, Stack, Text } from "@chakra-ui/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const StyledSwiper = styled(Swiper)`
	.swiper-pagination-bullet-active {
		background-color: #04c88a;
	}

	.swiper-button-prev,
	.swiper-button-next {
		color: #bcd709;
	}
`;

export const SimilarProductsMobile = ({ CID, PID }) => {
	const [products, setProducts] = useState([]);
	const navigate = useNavigate();

	useEffect(() => {
		fetchRecommendations();
		// eslint-disable-next-line
	}, [CID, PID]);

	const fetchRecommendations = async () => {
		try {
			const response = await Axios.get(`${process.env.REACT_APP_API_BASE_URL}/product/similar/${CID}?PID=${PID}`);
			setProducts(response.data.result);
		} catch (error) {
			console.error("Reccomendation endpoint not responding", error);
		}
	};

	const handleType = (type, nominal) => {
		if (type === "Extra") return `B 1 G ${nominal}`;
		if (type === "Numeric") return `- ${Math.floor(nominal / 1000).toLocaleString("id-ID")}K OFF!`;
		if (type === "Percentage") return `${nominal}% OFF!`;
	};

	return (
		<Box justifyContent="center" justifyItems="center" alignContent="center" alignItems="center" w={"100%"} h={"200px"}>
			<StyledSwiper
				modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
				spaceBetween={15}
				slidesPerView={1}
				navigation
				pagination={{ clickable: true }}
				autoplay={{ delay: 1500, disableOnInteraction: false }}
				autoHeight="true"
				height="100%"
				coverflowEffect={{ stretch: "100" }}
			>
				{products?.map((product, index) => (
					<SwiperSlide key={index} height="inherit">
						<Stack height="100%" width="100%" position="relative">
							<img
								src={`${process.env.REACT_APP_BASE_URL}/products/${product?.imgURL}`}
								alt={`recommended_${index + 1}`}
								onClick={() => navigate(`/product/${product?.id}`)}
								style={{
									display: "block",
									top: 0,
									left: 0,
									maxWidth: "100%",
									maxHeight: "450px",
									cursor: "pointer",
									borderRadius: "15px",
									objectFit: "cover",
								}}
							/>
							<Stack position="absolute" zIndex={1} top={5} right={5}>
								<Text fontFamily="monospace" fontSize="18px" color="black" textAlign={"right"}>
									{product?.productName}
								</Text>
							</Stack>
							<Stack position={"absolute"} zIndex={1} fontSize="10px" ml={"15px"}>
								<div style={{ fontFamily: "monospace", textAlign: "left" }}>
									<Text
										color="#CA3A3A"
										fontWeight="bold"
										fontSize="18px"
										fontFamily="monospace"
										textAlign={"left"}
										mt={"40px"}
									>
										{product?.likeCount}
									</Text>
									Others wants to buy this product.
								</div>
							</Stack>
							{product?.Discounts?.find((discount) => discount.isActive === true) && (
								<Stack zIndex={1} w={"100%"} mt={"110px"} position={"absolute"} align={"center"} justify={"center"}>
									<Badge
										zIndex={2}
										h={"20px"}
										w={"85px"}
										bgColor={"red.500"}
										px={1}
										variant={"outline"}
										borderRadius={"5px"}
									>
										<Text fontSize={"14px"} textAlign={"center"} color={"white"} overflow={"hidden"}>
											{handleType(product?.Discounts[0]?.type, product?.Discounts[0]?.nominal)}
										</Text>
									</Badge>
								</Stack>
							)}
							<Stack
								direction={"column"}
								w={"100%"}
								zIndex={1}
								position={"absolute"}
								mt={"135px"}
								align={"center"}
								justify={"center"}
							>
								<Badge
									variant={"subtle"}
									w={"100px"}
									colorScheme="green"
									color="#BCD709"
									fontFamily="monospace"
									fontStyle="italic"
									textAlign={"center"}
									fontSize="16px"
									css={{ textTransform: "none" }}
								>
									Rp. {Math.floor(product?.price / 1000).toLocaleString("id-ID")}K
								</Badge>
							</Stack>
						</Stack>
					</SwiperSlide>
				))}
			</StyledSwiper>
		</Box>
	);
};
