import Axios from "axios";
import { Box, Button, Flex, IconButton, Image } from "@chakra-ui/react";
import { MinusIcon, AddIcon } from "@chakra-ui/icons";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
// import { Navbar } from "../components/navbar";

export const ProductDetail = () => {
    const params = useParams();
    // const data = useSelector((state) => state.user.value.isAdmin);
    const [product, setProduct] = useState([]);
    const [category, setCategory] = useState({});
    const [quantity, setQuantity] = useState(1);

    const fetchData = async () => {
        try {
            const productResponse = await Axios.get(`http://localhost:8000/api/product/${params.id}`);
            setProduct(productResponse.data.result);
            const categoryResponse = await Axios.get(`http://localhost:8000/api/product/category/${productResponse.data.result.CategoryId}`);
            setCategory(categoryResponse.data.result.category);
        } catch (error) {
            console.error(error);
        };
    };

    useEffect(() => {
        fetchData();
    }, []);

    console.log(category);

    return (
        <Box>
            {/* <Box><Navbar /></Box> */}
            <Flex
                pt={{ base: "70px", sm: "100px" }}
                pl={{ base: "10px", sm: "30px", md: "50px" }}
                wrap={"wrap"}
                w={{ base: "100vw", sm: "100vw", md: "100vw" }}
                gap={"20px"}
            >

                <Box>
                    {Object.keys(category).length > 0 && (
                        <Box fontSize={{ base: "16px", sm: "18px", md: "20px" }} color="gray.600" mb="10px">
                            <Link to="/products">Browse Products</Link>
                            {" > "}
                            <Link to={`/category/${product.CategoryId}`}>{category}</Link>
                        </Box>
                    )}
                    <Box>
                        <Image
                            alignSelf={'left'}
                            borderRadius={"5px"}
                            boxShadow={"1px 2px 3px black"}
                            w={{ base: "550px", sm: "550px", md: "600px", lg: "700px" }}
                            h={{ base: "350px", sm: "350px", md: "400px", lg: "520px" }}
                            src={`http://localhost:8000/products/${product?.imgURL}`}
                        />
                    </Box>
                </Box>
                <Box>
                    <Box mb={"110px"} alignContent={"center"} mr={{ base: "5px" }} pl={'50px'}>
                        <Box
                            pb={"20px"}
                            borderBottom={"2px solid gray"}
                            textShadow={"2px 2px 2px gray"}
                            fontSize={{ base: "25px", sm: "35px", md: "45px" }}
                            color={"gray.700"}
                            fontFamily={"sans-serif"}
                            fontWeight={"bold"}
                        >
                            {product.productName}
                        </Box>
                        <Flex
                            fontSize={"20px"}
                            color={"gray.600"}
                            pb={"10px"}
                            borderBottom={"2px solid gray"}
                            fontFamily={"sans-serif"}
                        >
                            <Box fontSize={{ base: "15px", sm: "17px", md: "24px" }}>
                                Rp. {(product.price)?.toLocaleString("id-ID")},00
                            </Box>
                        </Flex>
                        <Flex
                            fontSize={"20px"}
                            color={"gray.600"}
                            pb={"10px"}
                            borderBottom={"2px solid gray"}
                            fontFamily={"sans-serif"}
                        >
                            <Box fontWeight={"bold"} fontSize={{ base: "15px", sm: "17px", md: "24px" }}>
                                In Stock :
                            </Box>
                            <Box ml={"5px"} fontSize={{ base: "15px", sm: "17px", md: "24px" }}>
                                {product.stock} units
                            </Box>
                        </Flex>
                        <Flex
                            fontSize={"20px"}
                            color={"gray.600"}
                            pb={"10px"}
                            borderBottom={"2px solid gray"}
                            fontFamily={"sans-serif"}
                        >
                            <Box fontWeight={"bold"} fontSize={{ base: "15px", sm: "17px", md: "24px" }}>
                                Product Weight :
                            </Box>
                            <Box ml={"5px"} fontSize={{ base: "15px", sm: "17px", md: "24px" }}>
                                {product.weight} grams
                            </Box>
                        </Flex>
                        <Box w={{ base: "250px", sm: "220px", md: "300px" }} fontSize={{ base: "15px", sm: "17px", md: "24px" }} fontFamily={"heading"} color={"gray.600"}>
                            <Box fontWeight={"bold"}>Product Description :</Box>
                            <Box>{product.description}</Box>
                            {/* Quantity Selection */}
                            <Flex align="center" mt="20px">
                                <IconButton
                                    aria-label="Decrease Quantity"
                                    icon={<MinusIcon />}
                                    size="sm"
                                    ml="10px"
                                />
                                <Box px="10px" fontSize="18px">{quantity}</Box>
                                <IconButton
                                    aria-label="Increase Quantity"
                                    icon={<AddIcon />}
                                    size="sm"
                                />
                                <Button
                                    mt="20px"
                                    colorScheme="blue"
                                >
                                    Add to Cart
                                </Button>
                            </Flex>
                        </Box>
                    </Box>
                </Box>
            </Flex>
        </Box>
    )
};
