import { Navigation, Scrollbar, A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import "./category.css"
import axios from "axios";
import { useEffect, useState } from "react";
import { CategoryCard } from "../../../components/category/card";
import { Flex } from "@chakra-ui/react";
import { useSelector } from "react-redux";

export const CategoryCarousel = () => {

  const [ categories, setCategories ] = useState([]);
  const token = localStorage.getItem('token');
  const { refresh } = useSelector((state) => state.category.value);

  const fetchCategoryUser = async() => {
      try {
          const { data } = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/category/user?limit=100`);
          setCategories(data.result);
      } catch (err) {
          console.log(err);
      }
  };

  const fetchCategoryAdmin = async() => {
      try {
          const { data } = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/category/admin`, {
              headers: {
                  authorization: `Bearer ${token}`
              }
          });
          setCategories(data.result);
      } catch (err) {
          console.log(err);
      }
  };

    useEffect(() => {
      fetchCategoryUser();
      // fetchCategoryAdmin();
  }, [ refresh ]);
  return (
    <Swiper
      modules={[Navigation, A11y, Scrollbar]}
      spaceBetween={50}
      loop={true}
      slidesPerView={3}
      navigation
      scrollbar={{draggable: true}}
    >
      {categories.map(({ id, category, imgURL, isDeleted }, idx) => {
            return (
              <SwiperSlide key={idx} >
                <CategoryCard 
                id={id}
                category={category} 
                categoryImage={`${process.env.REACT_APP_BASE_URL}/categories/${imgURL}`} 
                isDeleted={isDeleted}
                />
              </SwiperSlide>
            )
        })}
    </Swiper>
  );
};