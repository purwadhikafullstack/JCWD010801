<TabPanel key={"all"}>
	{products?.map((data, index, array) => {
		const isLastItem = index === array.length - 1;
		return (
			<Flex
				key={data.id}
				w={"1225px"}
				h={"100px"}
				align={"center"}
				borderBottom={isLastItem ? "none" : "1px solid black"}
			>
				<Flex w={"22px"} h={"75px"} justify={"center"} align={"center"}>
					<Checkbox
						isChecked={isChecked(data.id)}
						onChange={() => toggleCheckbox(data.id)}
						colorScheme="green"
						iconColor="white"
						size={"lg"}
					/>
				</Flex>
				<Flex w={"75px"} h={"75px"} justify={"center"} align={"center"} ml={"3px"}>
					<Image
						src={`${process.env.REACT_APP_BASE_URL}/products/${data?.imgURL}`}
						alt={data.productName}
						cursor={"pointer"}
						onClick={() => navigate(`/product/${data.id}`)}
						boxSize="75px"
						objectFit="cover"
					/>
				</Flex>
				<Flex
					className="scrollbar-4px"
					w={"173px"}
					h={"75px"}
					justify={"left"}
					align={"center"}
					ml={"1px"}
					overflow={"auto"}
					overflowX={"hidden"}
					overflowWrap={"break-word"}
					bgColor={"rgba(51, 50, 52, 0.2)"}
					borderRadius={"5px"}
				>
					<Text p={"3px"} onClick={() => navigate(`/product/${data.id}`)} cursor={"pointer"}>
						{data.productName}
					</Text>
				</Flex>
				<Flex
					className="scrollbar-4px"
					w={"249px"}
					h={"75px"}
					justify={"left"}
					align={"center"}
					ml={"6px"}
					overflow={"auto"}
					overflowX={"hidden"}
					overflowWrap={"break-word"}
					bgColor={"rgba(51, 50, 52, 0.1)"}
					borderRadius={"5px"}
				>
					<Text p={"3px"}>{data.description}</Text>
				</Flex>
				<Flex
					w={"100px"}
					h={"75px"}
					justify={"center"}
					align={"center"}
					textAlign={"center"}
					ml={"5px"}
					overflow={"auto"}
					overflowWrap={"break-word"}
					bgColor={"rgba(51, 50, 52, 0.2)"}
					borderRadius={"5px"}
				>
					<Text>Rp. {data.price.toLocaleString("id-ID")}</Text>
				</Flex>
				<Flex
					w={"85px"}
					h={"75px"}
					justify={"center"}
					align={"center"}
					textAlign={"center"}
					ml={"5px"}
					overflow={"auto"}
					overflowWrap={"break-word"}
					bgColor={"rgba(51, 50, 52, 0.1)"}
					borderRadius={"5px"}
				>
					<Text>{(data.weight / 1000).toFixed(2)} Kg</Text>
				</Flex>
				<Flex
					w={"120px"}
					h={"75px"}
					justify={"center"}
					align={"center"}
					textAlign={"center"}
					ml={"5px"}
					overflow={"auto"}
					overflowWrap={"break-word"}
					bgColor={"rgba(51, 50, 52, 0.2)"}
					borderRadius={"5px"}
				>
					<Text>{getCategoryLabel(data.CategoryId)}</Text>
				</Flex>
				<Flex
					w={"109px"}
					h={"75px"}
					justify={"center"}
					align={"center"}
					textAlign={"center"}
					ml={"5px"}
					overflow={"auto"}
					overflowWrap={"break-word"}
					bgColor={"rgba(51, 50, 52, 0.1)"}
					borderRadius={"5px"}
				>
					<Text>{data.aggregateStock} Units</Text>
				</Flex>
				<Flex
					w={"109px"}
					h={"75px"}
					justify={"center"}
					align={"center"}
					textAlign={"center"}
					ml={"8px"}
					overflow={"auto"}
					overflowWrap={"break-word"}
					bgColor={"rgba(51, 50, 52, 0.2)"}
					borderRadius={"5px"}
				>
					<Text>{data.aggregateStock} Units</Text>
				</Flex>
				<Flex w={"64px"} h={"75px"} justify={"center"} align={"center"} ml={"5px"}>
					<Switch
						size="lg"
						isChecked={isSwitched}
						onChange={() => {
							setIsSwitched(!isSwitched);
						}}
					/>
				</Flex>
				<Flex w={"71px"} h={"75px"} justify={"space-around"} align={"center"} ml={"5px"}>
					<FiEdit size={28} />
					<TiDelete size={40} color="#B90E0A" />
				</Flex>
			</Flex>
		);
	})}
</TabPanel>;
