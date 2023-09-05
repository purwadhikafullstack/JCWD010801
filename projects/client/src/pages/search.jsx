import Axios from "axios";
import {
  Box,
  Flex,
  Input,
  Radio,
  RadioGroup,
  Stack,
  Image,
  Button,
  Select,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export const Search = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [reload, setReload] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("productName");
  const [sortOrder, setSortOrder] = useState("ASC");
  const navigate = useNavigate();

  const fetchData = async (pageNum) => {
    try {
      let apiURL = `${process.env.REACT_APP_API_BASE_URL}/product/all?page=${pageNum}&sortBy=${sortBy}&sortOrder=${sortOrder}&search=${search}`;

      if (selectedCategory) {
        apiURL += `&CategoryId=${selectedCategory}`;
      }

      const productsResponse = await Axios.get(apiURL);
      setProducts(productsResponse.data.result);
      setPage(productsResponse.data.currentPage);
      setTotalPages(productsResponse.data.totalPages);
      const categoriesResponse = await Axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/product/categories`
      );
      const categoryData = categoriesResponse.data.result.map((data) => ({
        label: data.category,
        value: data.id,
      }));
      setCategories(categoryData);
    } catch (error) {
      console.log(error);
    }
  };

  const nextPage = () => {
    if (page < totalPages) {
      setPage((prevPage) => +prevPage + 1);
      setReload(!reload);
    }
  };

  const prevPage = () => {
    if (page > 1) {
      setPage((prevPage) => +prevPage - 1);
      setReload(!reload);
    }
  };

  const productDetail = (id) => {
    navigate(`/product/${id}`);
  };

  useEffect(() => {
    fetchData(page);
  }, [reload, search, sortOrder, selectedCategory, sortBy]);

  const customInputStyle = {
    borderColor: "gray",
    _focus: {
      boxShadow: "0 0 3px 2px #39393C",
      borderColor: "#39393C",
    },
    _placeholder: {
      color: "#535256",
      fontSize: "14px",
    },
    color: "#535256",
  };

  const customRadioStyle = {
    borderColor: "gray",
    _checked: {
      boxShadow: "0 0 3px 2px #39393C",
      bg: "transparent",
      color: "gray.700",
      borderColor: "gray.700",
      _before: {
        content: '""',
        display: "block",
        width: "50%",
        height: "50%",
        borderRadius: "50%",
        bg: "#4A4A4A",
      },
    },
    _focus: {
      boxShadow: "0 0 3px 2px #39393C",
    },
  };

  const customSelectStyle = {
    borderColor: "gray",
    _focus: {
      boxShadow: "0 0 3px 2px #39393C",
      borderColor: "#39393C",
    },
    _placeholder: {
      color: "#535256",
      fontSize: "14px",
      align: "center",
    },
    color: "#535256",
    bgColor: "white",
    _option: {
      _hover: {
        boxShadow: "0 0 10px 100px #1882A8 inset",
      },
    },
  };

  return (
    <Box>
      <Flex>
        <Box
          bgColor={"#F0F0F0"}
          borderRadius={"10px"}
          boxShadow={"0px 0px 5px gray"}
          w={"1000px"}
          h={"780px"}
          pt={"40px"}
          px={"20px"}
          my={"50px"}
          ml={"80px"}
        >
          <Box
            mb={"10px"}
            borderBottom={"1px solid"}
            borderColor={"gray.400"}
            pb={"20px"}
            align="center"
          >
            <Box mb={"15px"} fontSize={"22px"} color={"gray"}>
              Search For Products
            </Box>
            <Input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              w={"200px"}
              h={"30px"}
              border={"1px solid gray"}
              bgColor={"white"}
              placeholder="Enter a Product Name"
              {...customInputStyle}
            />
          </Box>
          <Box>
            <Box mb={"5px"} fontWeight={"thin"} color={"gray"}>
              Sort by
            </Box>
            <RadioGroup
              borderBottom={"1px solid"}
              borderColor={"gray.400"}
              mb={"10px"}
              pb={"20px"}
              onChange={(value) => setSortBy(value)}
              value={sortBy}
            >
              <Stack color={"gray"}>
                <Radio
                  isChecked={sortBy === "productName"}
                  borderColor={"gray"}
                  onChange={(e) => {
                    setSortBy("productName");
                  }}
                  {...customRadioStyle}
                >
                  Alphabetical
                </Radio>
                <Radio
                  isChecked={sortBy === "price"}
                  borderColor={"gray"}
                  onChange={(e) => {
                    setSortBy("price");
                  }}
                  {...customRadioStyle}
                >
                  Price
                </Radio>
                <Radio
                  isChecked={sortBy === "createdAt"}
                  borderColor={"gray"}
                  onChange={(e) => {
                    setSortBy("createdAt");
                  }}
                  {...customRadioStyle}
                >
                  Listing Time
                </Radio>
              </Stack>
            </RadioGroup>
          </Box>
          <Box>
            <Box mb={"5px"} fontWeight={"thin"} color={"gray"}>
              Order by
            </Box>
            <RadioGroup
              onChange={(value) => setSortOrder(value)}
              value={sortOrder}
              borderBottom={"1px solid"}
              borderColor={"gray.400"}
              mb={"10px"}
              pb={"20px"}
            >
              <Stack color={"gray"}>
                {sortBy === "productName" && (
                  <>
                    <Radio
                      borderColor={"gray"}
                      isChecked={sortOrder === "ASC"}
                      onChange={(e) => {
                        setSortOrder("ASC");
                      }}
                      {...customRadioStyle}
                    >
                      A - Z
                    </Radio>
                    <Radio
                      borderColor={"gray"}
                      isChecked={sortOrder === "DESC"}
                      onChange={(e) => {
                        setSortOrder("DESC");
                      }}
                      {...customRadioStyle}
                    >
                      Z - A
                    </Radio>
                  </>
                )}
                {sortBy === "price" && (
                  <>
                    <Radio
                      borderColor={"gray"}
                      isChecked={sortOrder === "ASC"}
                      onChange={(e) => {
                        setSortOrder("ASC");
                      }}
                      {...customRadioStyle}
                    >
                      Cheapest
                    </Radio>
                    <Radio
                      borderColor={"gray"}
                      isChecked={sortOrder === "DESC"}
                      onChange={(e) => {
                        setSortOrder("DESC");
                      }}
                      {...customRadioStyle}
                    >
                      Premium
                    </Radio>
                  </>
                )}
                {sortBy === "createdAt" && (
                  <>
                    <Radio
                      borderColor={"gray"}
                      isChecked={sortOrder === "ASC"}
                      onChange={(e) => {
                        setSortOrder("ASC");
                      }}
                      {...customRadioStyle}
                    >
                      Oldest
                    </Radio>
                    <Radio
                      borderColor={"gray"}
                      isChecked={sortOrder === "DESC"}
                      onChange={(e) => {
                        setSortOrder("DESC");
                      }}
                      {...customRadioStyle}
                    >
                      Newest
                    </Radio>
                  </>
                )}
              </Stack>
            </RadioGroup>
          </Box>
          <Box fontWeight={"thin"} color={"gray"}>
            Product Categories
            <Select
              mt={"10px"}
              placeholder="Select a Category"
              value={selectedCategory.toString()}
              onChange={(e) => {
                setSelectedCategory(parseInt(e.target.value, 10));
              }}
              w={"200px"}
              h={"30px"}
              border={"1px solid gray"}
              bgColor={"white"}
              {...customSelectStyle}
            >
              {categories.map((category) => (
                <option
                  key={category.value}
                  value={category.value.toString()}
                  style={{
                    backgroundColor:
                      selectedCategory === category.value
                        ? "#F0F0F0"
                        : "#FFFFFF",
                    color:
                      selectedCategory === category.value
                        ? "#18181A"
                        : "#535256",
                    fontWeight:
                      selectedCategory === category.value ? "bold" : "normal",
                    fontSize: "16px",
                    cursor: "pointer",
                  }}
                >
                  {category.label}
                </option>
              ))}
            </Select>
          </Box>
        </Box>
        <Flex justifyContent={"center"} pt={"50px"} w={"full"}>
          <Flex>
            <Box>
              <Flex
                justifyContent={"center"}
                wrap={"wrap"}
                px={"30px"}
                w={"1100px"}
                h={"500px"}
                gap={"15px"}
              >
                {products?.map((data) => {
                  return (
                    <Box
                      key={data.id}
                      display="flex"
                      flexDirection="column"
                      cursor={"pointer"}
                      boxShadow={"0px 0px 5px gray"}
                      borderRadius={"10px"}
                      w={"190px"}
                      h={"250px"}
                      onClick={() => productDetail(data.id)}
                    >
                      <Box h={"165px"}>
                        <Image
                          borderTopRadius={"9px"}
                          w={"full"}
                          h={"full"}
                          src={`${process.env.REACT_APP_BASE_URL}/products/${data?.imgURL}`}
                        />
                      </Box>
                      <Box
                        flex="1"
                        display="flex"
                        flexDirection="column"
                        borderBottomRadius={"10px"}
                        textShadow={"0px 0px 1px gray"}
                        justifyContent={"center"}
                        fontFamily={"revert"}
                        bgColor={"#F0F0F0"}
                        color={"gray.700"}
                        pt={"10px"}
                        pb={"25px"}
                        px={"25px"}
                        width="100%"
                        whiteSpace="nowrap"
                        overflow="hidden"
                        textOverflow="ellipsis"
                      >
                        <Box
                          color={"gray.700"}
                          mb={1}
                          textAlign={"center"}
                          fontWeight={"bold"}
                          fontSize={"16px"}
                          overflow="hidden"
                          textOverflow="ellipsis"
                        >
                          {data.productName}
                        </Box>
                        <Box
                          color={"gray.700"}
                          textAlign={"center"}
                          fontSize={"15px"}
                          overflow="hidden"
                          textOverflow="ellipsis"
                        >
                          Rp. {data.price.toLocaleString("id-ID")}
                        </Box>
                      </Box>
                    </Box>
                  );
                })}
              </Flex>
              <Flex
                justifyContent={"center"}
                gap={"50px"}
                mt={"330px"}
                mb={"50px"}
              >
                {totalPages > 1 && page > 1 && (
                  <Button
                    backgroundColor={"#000000"}
                    color={"white"}
                    _hover={{
                      textColor: "#0A0A0B",
                      bg: "#F0F0F0",
                      _before: {
                        bg: "inherit",
                      },
                      _after: {
                        bg: "inherit",
                      },
                    }}
                    onClick={prevPage}
                  >
                    Prev.
                  </Button>
                )}
                {page < totalPages && (
                  <Button
                    backgroundColor={"#000000"}
                    color={"white"}
                    _hover={{
                      textColor: "#0A0A0B",
                      bg: "#F0F0F0",
                      _before: {
                        bg: "inherit",
                      },
                      _after: {
                        bg: "inherit",
                      },
                    }}
                    onClick={nextPage}
                  >
                    Next
                  </Button>
                )}
              </Flex>
            </Box>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
};