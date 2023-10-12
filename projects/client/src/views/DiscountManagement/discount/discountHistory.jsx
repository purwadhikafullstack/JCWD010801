import { Stack, Table, Thead, Tr, Th, Td, Badge, Flex, Image, Text, Tbody, Input, Select, InputGroup, InputRightElement } from "@chakra-ui/react";
import axios from "axios"
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pagination } from "../../../components/navigation/pagination";
import { ButtonTemp } from "../../../components/button";
import { BiSort, BiSortDown, BiSortUp } from "react-icons/bi";
import { useSelector } from "react-redux";

export const DiscountHistory = () => {
    const [ discount, setDiscount ] = useState([]);
    const [ branches, setBranches ] = useState([]);
    const [ totalPages, setTotalPages ] = useState(1);
    const [page, setPage] = useState(1);
    const [ total, setTotal ] = useState(1);
    const [ sortBy, setSortBy ] = useState("id");
    const [ order, setOrder ] = useState(true);
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const searchRef = useRef();
    const typeRef = useRef();
    const startAvailableFromRef = useRef();
    const endAvailableFromRef = useRef();
    const startValidUntilRef = useRef();
    const endValidUntilRef = useRef();
    const branchIdRef = useRef();

    const RoleId = useSelector((state) => state.user.value.RoleId);

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

    const fetchBranches = async() => {
        try {
            const { data } = await axios.get(
                `${process.env.REACT_APP_API_BASE_URL}/branch`
                , {
                headers: {
                    authorization: `Bearer ${token}`
                }
            });
            setBranches(data.result);
        } catch (err) {
            console.log(err);
        }
    }

    const fetchData = async() => {
        try {
            let branchId
            const search = searchRef.current.value
            const type = typeRef.current.value
            const startAvailableFrom = startAvailableFromRef.current.value
            const endAvailableFrom = endAvailableFromRef.current.value
            const startValidUntil = startValidUntilRef.current.value
            const endValidUntil = endValidUntilRef.current.value
            if (RoleId === 3) branchId = branchIdRef.current.value
            const { data } = await axios.get(
                `${process.env.REACT_APP_API_BASE_URL}/discount?limit=8&type=${type}&page=${page}&branchId=${branchId}&search=${search}&startAvailableFrom=${startAvailableFrom}&endAvailableFrom=${endAvailableFrom}&startValidUntil=${startValidUntil}&endValidUntil=${endValidUntil}&sortBy=${sortBy}&order=${order ? "ASC" : "DESC"}`
                , {
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
        fetchBranches();
    }, []);

    useEffect(() => {
        fetchData()
    }, [ sortBy, order, page ]);

    return (
        <Stack w={"100%"} gap={5}>
            <Stack gap={7} w={"100%"}>
                <Flex alignItems={"center"} gap={8}>
                    <Stack>
                        <Text fontWeight={"semibold"} color={"gray"}>Start Date</Text>
                        <Flex alignItems={"center"} gap={3}>
                            <Input onChange={fetchData} ref={startAvailableFromRef} type="datetime-local" focusBorderColor="gray.500" />
                            <Text fontWeight={"semibold"} color={"gray"}>to</Text>
                            <Input onChange={fetchData} ref={endAvailableFromRef} type="datetime-local" focusBorderColor="gray.500" />
                        </Flex>
                    </Stack>
                    <Stack>
                        <Text fontWeight={"semibold"} color={"gray"}>End Date</Text>
                        <Flex alignItems={"center"} gap={3}>
                            <Input onChange={fetchData} ref={startValidUntilRef} type="datetime-local" focusBorderColor="gray.500" />
                            <Text fontWeight={"semibold"} color={"gray"}>to</Text>
                            <Input onChange={fetchData} ref={endValidUntilRef} type="datetime-local" focusBorderColor="gray.500" />
                        </Flex>
                    </Stack>
                </Flex>
                <Flex alignItems={"center"} gap={3}>
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
                    <Select w={"150px"} borderColor={"gray.300"} focusBorderColor="gray.500" defaultValue={""} ref={typeRef} onChange={fetchData}>
                        <option value={""}>All Types</option>
                        <option value={"Numeric"}>Fixed Amount</option>
                        <option value={"Percentage"}>Percentage</option>
                        <option value={"Extra"}>Extra</option>
                    </Select>
                    {RoleId === 3 && (
                        <Select w={"150px"} borderColor={"gray.300"} focusBorderColor="gray.500" defaultValue={""} ref={branchIdRef} onChange={fetchData}>
                            <option value={""}>All Branches</option>
                            {branches.map(( { name, id } ) => {
                                return (
                                    <option value={id}>{name}</option>
                                )
                            })}
                        </Select>
                    )}
                </Flex>
            </Stack>
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
                        {RoleId === 3 && (<Th textAlign={"center"}>Branch</Th>)}
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
                        <Th textAlign={"center"}>Status</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {discount.map(({ Product, type, nominal, availableFrom, validUntil, isActive, id, Branch }, idx) => {
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
                                        {type === "Numeric" ? "Fixed Amount" : type === "Extra" ? "Buy 1 Get 1" : type}
                                    </Text>
                                </Td>
                                <Td>
                                    <Text fontWeight={type === "Extra" && "bold"} textAlign={type === "Extra" && "center"}>
                                        {type === "Extra" ? `---` : type === "Percentage" ? `${nominal}%` : `Rp. ${nominal.toLocaleString("id-ID")}`}
                                    </Text>
                                </Td>
                                <Td>
                                    <Text> {`Rp. ${Product.price.toLocaleString("id-ID")}`} </Text>
                                </Td>
                                <Td>
                                    {type === "Extra" ? (
                                    <Text fontWeight={"bold"} textAlign={"center"}>{`---`}</Text>
                                    ) : (
                                        <Text> {countDiscount()} </Text>
                                    )}
                                </Td>
                                {RoleId === 3 && (
                                    <Td>
                                        <Text>{Branch?.name}</Text>
                                    </Td>
                                )}
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
                                <Td alignItems={"center"} justifyContent={"center"}>
                                    {(new Date(availableFrom) < new Date(Date.now()) && new Date(Date.now()) < new Date(validUntil) && isActive) ? (
                                        <Badge colorScheme="green">ACTIVE</Badge>
                                    ) : (new Date(availableFrom) < new Date(Date.now()) && new Date(Date.now()) < new Date(validUntil) && !isActive) ? (
                                        <Badge colorScheme="red">CANCELLED</Badge>
                                    ) : (
                                        <Badge>EXPIRED</Badge>
                                    )}
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