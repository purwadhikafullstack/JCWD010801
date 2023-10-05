import { Stack, Table, Thead, Tr, Th, Td, Badge, Flex, Image, Text, Tbody, Input, Select, InputGroup, InputRightElement } from "@chakra-ui/react";
import axios from "axios"
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pagination } from "../../../components/navigation/pagination";
import { ButtonTemp } from "../../../components/button";
import { BiSort, BiSortDown, BiSortUp } from "react-icons/bi";

export const OngoingDiscount = () => {
    const [ discount, setDiscount ] = useState([]);
    const [ totalPages, setTotalPages ] = useState(1);
    const [page, setPage] = useState(1);
    const [ total, setTotal ] = useState(1);
    const [ sortBy, setSortBy ] = useState("id");
    const [ order, setOrder ] = useState("ASC");
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const searchRef = useRef();
    const typeRef = useRef();

    const nextPage = () => {
		if (page < totalPages) {
			setPage((prevPage) => +prevPage + 1);
		}
	};

	const prevPage = () => {
		if (page > 1) {
			setPage((prevPage) => +prevPage - 1);
		}
	};

    const goToPage = (page) => {
		setPage(page);
	};

    const fetchData = async() => {
        try {
            const search = searchRef.current.value
            const type = typeRef.current.value
            const { data } = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/discount/ongoing?limit=10&page=${page}&search=${search}&type=${type}&sortBy=${sortBy}&order=${order ? "ASC" : "DESC"}`, {
                headers: {
                    authorization: `Bearer ${token}`
                }
            });
            setDiscount(data.result);
            setTotal(data.total);
            setTotalPages(data.totalPages);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        fetchData()
    }, [ page, order, sortBy ]);

    return (
        <Stack w={"100%"} gap={5}>
            <Flex justifyContent={"space-between"} w={"100%"}>
                <Flex alignItems={"end"} gap={3}>
                    <InputGroup w={"300px"}>
                        <Input
                        type="search"
                        placeholder={"Search by product name"}
                        focusBorderColor="gray.500"
                        borderColor={"gray.300"}
                        ref={searchRef}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                fetchData();
                            }
                        }}
                        />
                        <InputRightElement w={20} p={1}>
                            <ButtonTemp onClick={fetchData} size={"sm"} content={"Search"} />
                        </InputRightElement>
                    </InputGroup>
                    <Select w={"150px"} borderColor={"gray.300"} focusBorderColor="gray.500" defaultValue={""} ref={typeRef} onClick={fetchData}>
                        <option value={""}>All Types</option>
                        <option value={"Numeric"}>Fixed Amount</option>
                        <option value={"Percentage"}>Percentage</option>
                        <option value={"Extra"}>Extra</option>
                    </Select>
                </Flex>
            </Flex>
            {discount.length > 0 ? (
            <Table size="sm" variant={"striped"}>
                <Thead
                style={{
                    position: "sticky",
                    top: 0,
                    zIndex: 1,
                    backgroundColor: "#FFFFFF",
                }}>
                    <Tr>
                        <Th
                        cursor={"pointer"}
                        onClick={() => {
                            setSortBy("id");
                            setOrder(!order)
                        }}
                        >
                            <Flex gap={2} alignItems={"center"} justifyContent={"center"}>
                                <Text>ID</Text>
                                {sortBy === "id" && order ? (
                                    <BiSortDown size={15} />
                                ) : sortBy === "id" && !order ? (
                                    <BiSortUp size={15} />
                                ) : (
                                    <BiSort size={15} color="#3E3D40" />
                                )}
                            </Flex>
                        </Th>
                        <Th
                        cursor={"pointer"}
                        onClick={() => {
                            setSortBy("productName");
                            setOrder(!order)
                        }}
                        >
                            <Flex gap={2} alignItems={"center"} justifyContent={"center"}>
                                <Text>Product</Text>
                                {sortBy === "productName" && order ? (
                                    <BiSortDown size={15} />
                                ) : sortBy === "productName" && !order ? (
                                    <BiSortUp size={15} />
                                ) : (
                                    <BiSort size={15} color="#3E3D40" />
                                )}
                            </Flex>
                        </Th>
                        <Th textAlign={"center"}>Type</Th>
                        <Th textAlign={"center"}>Nominal</Th>
                        <Th
                        cursor={"pointer"}
                        onClick={() => {
                            setSortBy("price");
                            setOrder(!order)
                        }}
                        >
                            <Flex gap={2} alignItems={"center"} justifyContent={"center"}>
                                <Text>Price</Text>
                                {sortBy === "price" && order ? (
                                    <BiSortDown size={15} />
                                ) : sortBy === "price" && !order ? (
                                    <BiSortUp size={15} />
                                ) : (
                                    <BiSort size={15} color="#3E3D40" />
                                )}
                            </Flex>
                        </Th>
                        <Th textAlign={"center"}>Discounted Price</Th>
                        <Th
                        cursor={"pointer"}
                        onClick={() => {
                            setSortBy("availableFrom");
                            setOrder(!order)
                        }}
                        >
                            <Flex gap={2} alignItems={"center"} justifyContent={"center"}>
                                <Text>Start Date</Text>
                                {sortBy === "availableFrom" && order ? (
                                    <BiSortDown size={15} />
                                ) : sortBy === "availableFrom" && !order ? (
                                    <BiSortUp size={15} />
                                ) : (
                                    <BiSort size={15} color="#3E3D40" />
                                )}
                            </Flex>
                        </Th>
                        <Th
                        cursor={"pointer"}
                        onClick={() => {
                            setSortBy("validUntil");
                            setOrder(!order)
                        }}
                        >
                            <Flex gap={2} alignItems={"center"} justifyContent={"center"}>
                                <Text>End Date</Text>
                                {sortBy === "validUntil" && order ? (
                                    <BiSortDown size={15} />
                                ) : sortBy === "validUntil" && !order ? (
                                    <BiSortUp size={15} />
                                ) : (
                                    <BiSort size={15} color="#3E3D40" />
                                )}
                            </Flex>
                        </Th>
                        <Th textAlign={"center"}>Action</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {discount.map(({ Product, type, nominal, availableFrom, validUntil, id }, idx) => {
                        const countDiscount = () => {
                            if (type === "Percentage") {
                                const deductedPrice = nominal / 100 * Product.price
                                const postDiscount = Product.price - deductedPrice
                                return `Rp. ${(postDiscount.toLocaleString("id-ID"))}`
                            } else if (type === "Numeric") {
                                const postDiscount = Product.price - nominal
                                return ` Rp. ${(postDiscount.toLocaleString("id-ID"))}`   
                            }
                        }
                        return (
                            <Tr key={idx}>
                                <Td>{id}.</Td>
                                <Td>
                                    <Flex gap={2} alignItems={"center"}>
                                        <Image
                                            src={`${process.env.REACT_APP_BASE_URL}/products/${Product?.imgURL}`}
                                            alt={Product?.productName}
                                            cursor={"pointer"}
                                            onClick={() => navigate(`/product/${Product?.id}`)}
                                            boxSize="75px"
                                            objectFit="cover"
                                            borderRadius={"5px"}
                                        />
                                        <Text>
                                            {Product?.productName}
                                        </Text>
                                    </Flex>
                                </Td>
                                <Td>
                                    <Text>
                                        {type === "Numeric" ? "Fixed Amount" : type}
                                    </Text>
                                </Td>
                                <Td>
                                    <Text>
                                        {type === "Extra" ? `${nominal} items` : type === "Percentage" ? `${nominal}%` : `Rp. ${nominal.toLocaleString("id-ID")}`}
                                    </Text>
                                </Td>
                                <Td>
                                    <Text> {`Rp. ${Product.price.toLocaleString("id-ID")}`} </Text>
                                </Td>
                                <Td>
                                    {type === "Extra" ? (
                                    <Text>{`Buy 1 get ${nominal}`}</Text>
                                    ) : (
                                        <Text> {countDiscount()} </Text>
                                    )}
                                </Td>
                                <Td>
                                    <Text>
                                        {new Date(availableFrom).toLocaleString("en-EN", {
                                            timeStyle: "medium",
                                            dateStyle: "long"
                                        })}
                                    </Text>
                                </Td>
                                <Td>
                                    <Text>
                                        {new Date(validUntil).toLocaleString("en-EN", {
                                            timeStyle: "medium",
                                            dateStyle: "long"
                                        })}
                                    </Text>
                                </Td>
                                <Td justifyContent={"center"}>
                                    Update
                                </Td>
                            </Tr>
                        )
                    })}
                </Tbody>
            </Table>
            ) : (
                <Text>
                    Data not found
                </Text>
            )}
            {discount.length > 0 ? (
                <Pagination
                    page={page}
                    totalPages={totalPages}
                    prevPage={prevPage}
                    nextPage={nextPage}
                    goToPage={goToPage}
                    lastPage={totalPages}
                />
            ) : null}
        </Stack>
    )
}