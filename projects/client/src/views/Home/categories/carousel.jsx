import { Navigation, Scrollbar, A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/scrollbar';
import "./category.css"
import axios from "axios";
import { useEffect, useState } from "react";
import { CategoryCard } from "../../../components/category/card";
import { useSelector } from "react-redux";
import { useMediaQuery } from 'react-responsive';

export const CategoryCarousel = () => {

  const [ categories, setCategories ] = useState([]);
  const token = localStorage.getItem('token');
  const { refresh } = useSelector((state) => state.category.value);
  const { RoleId } = useSelector((state) => state.user.value)

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

  const sizeLg = useMediaQuery({ query: "(min-width: 1000px)" });
  const sizeMd = useMediaQuery({ query: "(min-width: 767px)" });

    useEffect(() => {
      if (RoleId > 1) fetchCategoryAdmin()
      else fetchCategoryUser()
  }, [ refresh ]);
  return (
    <>
    {sizeLg ? (
    <Swiper
      modules={[Navigation, A11y, Scrollbar]}
      slidesPerView={4}
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
    ) : sizeMd ? (
      <Swiper
      modules={[Navigation, A11y, Scrollbar]}
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
    ) : (
      <Swiper
      modules={[Navigation, A11y, Scrollbar]}
      slidesPerView={2}
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
    )}
    </>
  );
};