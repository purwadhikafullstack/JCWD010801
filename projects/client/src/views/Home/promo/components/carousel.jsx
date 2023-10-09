import { Navigation, Scrollbar, A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/scrollbar';
import "./promo.css"
import axios from "axios";
import { useEffect, useState } from "react";
import { useMediaQuery } from 'react-responsive';
import { ProductCard } from './card';

export const DiscountCarousel = () => {

  const [ discount, setDiscount ] = useState([]);
  const token = localStorage.getItem('token');
  const BranchId = localStorage.getItem('BranchId');

  const fetchData = async() => {
    try {
        const { data } = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/discount/ongoing?branchId=${BranchId}`, {
            headers: {
                authorization: `Bearer ${token}`
            }
        });
        setDiscount(data.result);
    } catch (err) {
        console.log(err);
    }
}

  const sizeLg = useMediaQuery({ query: "(min-width: 1250px)" });
  const sizeMd = useMediaQuery({ query: "(min-width: 767px)" });

  useEffect(() => {
    fetchData()
  }, []);
  return (
    <>
    {sizeLg ? (
    <Swiper
      modules={[Navigation, A11y, Scrollbar]}
      slidesPerView={4}
      navigation
      scrollbar={{draggable: true}}
    >
      {discount.map(({ Product, type, nominal, validUntil, ProductId }, idx) => {
            return (
              <SwiperSlide key={idx} >
                <ProductCard 
                Product={Product}
                type={type}
                nominal={nominal}
                validUntil={validUntil}
                ProductId={ProductId}
                />
              </SwiperSlide>
            )
        })}
    </Swiper>
    ) : sizeMd ? (
      <Swiper
      modules={[Navigation, A11y, Scrollbar]}
      slidesPerView={3}
      navigation
      scrollbar={{draggable: true}}
    >
      {discount.map(({ Product, type, nominal, validUntil, ProductId }, idx) => {
            return (
              <SwiperSlide key={idx} >
                <ProductCard 
                Product={Product}
                type={type}
                nominal={nominal}
                validUntil={validUntil}
                ProductId={ProductId}
                />
              </SwiperSlide>
            )
        })}
    </Swiper>
    ) : (
      <Swiper
      modules={[Navigation, A11y, Scrollbar]}
      slidesPerView={2}
      scrollbar={{draggable: true}}
    >
      {discount.map(({ Product, type, nominal, validUntil, ProductId }, idx) => {
            return (
              <SwiperSlide key={idx} >
                <ProductCard 
                Product={Product}
                type={type}
                nominal={nominal}
                validUntil={validUntil}
                ProductId={ProductId}
                />
              </SwiperSlide>
            )
        })}
    </Swiper>
    )}
    </>
  );
};