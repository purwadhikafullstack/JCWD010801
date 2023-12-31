import { Navigation, Scrollbar, A11y } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/scrollbar";
import "../../promo/components/promo.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { ProductCard } from "../../promo/components/card";

export const SuggestionsCarousel = () => {
	const [products, setProducts] = useState([]);
	const currentBranch = localStorage.getItem("BranchId");

	const fetchData = async () => {
		try {
			const { data } = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/product/suggestions?limit=12`);
			setProducts(data.result);
		} catch (err) {
			console.log(err);
		}
	};

	const sizeLg = useMediaQuery({ query: "(min-width: 1250px)" });
	const sizeMd = useMediaQuery({ query: "(min-width: 767px)" });

	useEffect(() => {
		fetchData();
	}, []);
	return (
		<>
			{sizeLg ? (
				<Swiper modules={[Navigation, A11y, Scrollbar]} slidesPerView={4} navigation scrollbar={{ draggable: true }}>
					{products.map((item, idx) => {
						const discountData = item?.Discounts?.find((discount) => {
							return discount.BranchId === parseInt(currentBranch) && discount.isActive === true && new Date(discount.validUntil) > new Date( Date.now()) ;
						});
						return (
							<SwiperSlide key={idx}>
								<ProductCard
									Product={item}
									ProductId={item?.id}
									type={discountData?.type}
									nominal={discountData?.nominal}
								/>
							</SwiperSlide>
						);
					})}
				</Swiper>
			) : sizeMd ? (
				<Swiper modules={[Navigation, A11y, Scrollbar]} slidesPerView={3} navigation scrollbar={{ draggable: true }}>
					{products.map((item, idx) => {
						const discountData = item?.Discounts?.find((discount) => {
							return discount.BranchId === parseInt(currentBranch) && discount.isActive === true && new Date(discount.validUntil) > new Date(Date.now()) ;
						});
						return (
							<SwiperSlide key={idx}>
								<ProductCard
									Product={item}
									ProductId={item?.id}
									type={discountData?.type}
									nominal={discountData?.nominal}
								/>
							</SwiperSlide>
						);
					})}
				</Swiper>
			) : (
				<Swiper modules={[Navigation, A11y, Scrollbar]} slidesPerView={2} scrollbar={{ draggable: true }}>
					{products.map((item, idx) => {
						const discountData = item?.Discounts?.find((discount) => {
							return discount.BranchId === parseInt(currentBranch) && discount.isActive === true && new Date(discount.validUntil) > new Date( Date.now()) ;
						});
						return (
							<SwiperSlide key={idx}>
								<ProductCard
									Product={item}
									ProductId={item?.id}
									type={discountData?.type}
									nominal={discountData?.nominal}
								/>
							</SwiperSlide>
						);
					})}
				</Swiper>
			)}
		</>
	);
};
