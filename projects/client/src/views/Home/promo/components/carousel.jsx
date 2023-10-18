import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/scrollbar";
import "./promo.css";
import { Navigation, Scrollbar, A11y } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useMediaQuery } from "react-responsive";
import { ProductCard } from "./card";

export const DiscountCarousel = ({ discount }) => {
	const sizeLg = useMediaQuery({ query: "(min-width: 1250px)" });
	const sizeMd = useMediaQuery({ query: "(min-width: 767px)" });
	
	return (
		<>
			{sizeLg ? (
				<Swiper modules={[Navigation, A11y, Scrollbar]} slidesPerView={4} navigation scrollbar={{ draggable: true }}>
					{discount.map(({ Product, type, nominal, validUntil, ProductId }, idx) => {
						return (
							<SwiperSlide key={idx}>
								<ProductCard
									Product={Product}
									type={type}
									nominal={nominal}
									validUntil={validUntil}
									ProductId={ProductId}
								/>
							</SwiperSlide>
						);
					})}
				</Swiper>
			) : sizeMd ? (
				<Swiper modules={[Navigation, A11y, Scrollbar]} slidesPerView={3} navigation scrollbar={{ draggable: true }}>
					{discount.map(({ Product, type, nominal, validUntil, ProductId }, idx) => {
						return (
							<SwiperSlide key={idx}>
								<ProductCard
									Product={Product}
									type={type}
									nominal={nominal}
									validUntil={validUntil}
									ProductId={ProductId}
								/>
							</SwiperSlide>
						);
					})}
				</Swiper>
			) : (
				<Swiper modules={[Navigation, A11y, Scrollbar]} slidesPerView={2} scrollbar={{ draggable: true }}>
					{discount.map(({ Product, type, nominal, validUntil, ProductId }, idx) => {
						return (
							<SwiperSlide key={idx}>
								<ProductCard
									Product={Product}
									type={type}
									nominal={nominal}
									validUntil={validUntil}
									ProductId={ProductId}
								/>
							</SwiperSlide>
						);
					})}
				</Swiper>
			)}
		</>
	);
};
