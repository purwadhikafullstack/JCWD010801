import { Stack, Heading, Flex } from "@chakra-ui/react";
import { DiscountCarousel } from "./components/carousel";
import { useEffect, useState } from "react";
import axios from "axios";

export const HomePromos = () => {
  const [discount, setDiscount] = useState([]);
	const BranchId = localStorage.getItem("BranchId");

	const fetchData = async () => {
		try {
			const { data } = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/discount/ongoing?branchId=${BranchId}`);
			setDiscount(data.result);
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		fetchData();
		// eslint-disable-next-line
	}, []);
  return (
    <>
    {discount.length > 0 && (
      <Stack gap={5} w="100%">
        <Flex w='100%' alignItems={'center'} >
          <Heading fontSize={"3xl"} fontWeight={"semibold"}>
            On Sale
          </Heading>
        </Flex>
        <DiscountCarousel discount={discount} />
      </Stack>
    )}
    </>
  );
};