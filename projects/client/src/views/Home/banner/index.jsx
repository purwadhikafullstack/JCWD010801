import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import "./banner.css";
import Banner0 from "../../../assets/public/banners/banner0.jpg";
import Banner1 from "../../../assets/public/banners/banner1.jpg";
import Banner2 from "../../../assets/public/banners/banner2.jpg";
import Banner3 from "../../../assets/public/banners/banner3.jpg";
import { Navigation, Pagination, Autoplay, A11y } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Image } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export const Banner = () => {
	const navigate = useNavigate();

	return (
		<Swiper
			modules={[Navigation, Pagination, A11y, Autoplay]}
			spaceBetween={50}
			loop={true}
			slidesPerView={1}
			navigation
			autoplay={{
				delay: 5000,
				disableOnInteraction: false,
			}}
			pagination={{ clickable: true }}
		>
			<SwiperSlide>
				<Image
					height={{ base: "200px", md: "auto" }}
					src={Banner0}
					w={"500px"}
					borderRadius={"10px"}
					cursor={"pointer"}
					onClick={() => navigate(`/search`)}
				/>
			</SwiperSlide>
			<SwiperSlide>
				<Image
					height={{ base: "200px", md: "auto" }}
					src={Banner1}
					w={"500px"}
					borderRadius={"10px"}
					cursor={"pointer"}
					onClick={() => navigate(`/search?cat=3`)}
				/>
			</SwiperSlide>
			<SwiperSlide>
				<Image
					height={{ base: "200px", md: "auto" }}
					src={Banner2}
					w={"500px"}
					borderRadius={"10px"}
					cursor={"pointer"}
					onClick={() => navigate(`/search?cat=4`)}
				/>
			</SwiperSlide>
			<SwiperSlide>
				<Image
					height={{ base: "200px", md: "auto" }}
					src={Banner3}
					w={"500px"}
					borderRadius={"10px"}
					cursor={"pointer"}
					onClick={() => navigate(`/search?cat=2`)}
				/>
			</SwiperSlide>
		</Swiper>
	);
};
