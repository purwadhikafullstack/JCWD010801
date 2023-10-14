import { Navigation, Pagination, Autoplay, A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import "./banner.css"
import slide1 from "../../../assets/public/AM_logo.png";
import slide2 from "../../../assets/public/AM_bg_login.png";
import slide3 from "../../../assets/public/AM_backgroundLogin.png";
import { Image } from '@chakra-ui/react';

export const Banner = () => {
  return (
    <Swiper
      modules={[Navigation, Pagination, A11y, Autoplay]}
      spaceBetween={50}
      loop={true}
      slidesPerView={1}
      navigation
      autoplay={{
        delay: 5000,
        disableOnInteraction: false
      }}
      pagination={{ clickable: true }}
    >
      <SwiperSlide> <Image height={{ base: "200px", lg: "auto" }} src={slide1} w={'500px'} /> </SwiperSlide>
      <SwiperSlide> <Image height={{ base: "200px", lg: "auto" }} src={slide2} w={'500px'} /> </SwiperSlide>
      <SwiperSlide> <Image height={{ base: "200px", lg: "auto" }} src={slide3} w={'500px'} /> </SwiperSlide>
    </Swiper>
  );
};