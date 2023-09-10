import axios from "axios";
import { useEffect, useState } from "react";
import { CategoryCard } from "../../../components/category/card";
import { Flex } from "@chakra-ui/react";
import { useSelector } from "react-redux";

export const HomeCategoryPrototype = () => {
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
        <Flex 
        gap={5} 
        w='100%' 
        overflowX={'auto'}
        // sx={
        //     { 
        //    '::-webkit-scrollbar':{
        //           display:'none'
        //       }
        //    }
        //  }
        >
        {categories.map(({ id, category, imgURL, isDeleted }, idx) => {
            return (
                <CategoryCard 
                key={idx} 
                id={id}
                category={category} 
                categoryImage={`${process.env.REACT_APP_BASE_URL}/categories/${imgURL}`} 
                isDeleted={isDeleted}
                />
            )
        })}
        </Flex>
    )
}