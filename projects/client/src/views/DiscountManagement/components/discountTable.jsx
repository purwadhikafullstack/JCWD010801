import axios from "axios"
import { useState } from "react";

export const DiscountTable = () => {
    const [ discount, setDiscount ] = useState([]);

    const fetchData = async(type) => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/discount?type=${type}`, {
                headers: {
                    authorization: `Bearer ${token}`
                }
            });
            setVouchers(data.result);
        } catch (err) {
            console.log(err);
        }
    }
}