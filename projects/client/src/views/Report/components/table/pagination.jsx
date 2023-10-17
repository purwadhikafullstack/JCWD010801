import React from "react";
import {
	Flex,
	IconButton,
	NumberInput,
	NumberInputField,
	NumberInputStepper,
	NumberIncrementStepper,
	NumberDecrementStepper,
	Select,
	Tooltip,
	Text,
	useBreakpointValue,
} from "@chakra-ui/react";
import { ArrowLeftIcon, ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";

function Pagination({
	pageIndex,
	pageCount,
	canPreviousPage,
	canNextPage,
	gotoPage,
	previousPage,
	nextPage,
	pageSize,
	setPageSize,
	updateQueryObj,
}) {
	const isMobile = useBreakpointValue({ base: true, md: false });

	return (
		<Flex direction={isMobile ? "column" : "row"} justifyContent="space-between" m={4} alignItems="center">
			{!isMobile && (
				<Flex>
					<Tooltip label="First Page">
						<IconButton
							backgroundColor="#000000"
							color="white"
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
							onClick={() => {
								updateQueryObj({ page: 0 });
								gotoPage(0);
							}}
							isDisabled={!canPreviousPage}
							icon={<ArrowLeftIcon h={3} w={3} />}
							mr={4}
						/>
					</Tooltip>
					<Tooltip label="Previous Page">
						<IconButton
							backgroundColor="#000000"
							color="white"
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
							onClick={() => {
								previousPage();
								updateQueryObj({ page: pageIndex - 1 });
							}}
							isDisabled={!canPreviousPage}
							icon={<ChevronLeftIcon h={6} w={6} />}
						/>
					</Tooltip>
				</Flex>
			)}

			<Flex alignItems="center" mt={isMobile ? 4 : 0}>
				{!isMobile && (
					<>
						<Text flexShrink="0" mr={8}>
							Page{" "}
							<Text fontWeight="bold" as="span">
								{pageIndex + 1}
							</Text>{" "}
							of{" "}
							<Text fontWeight="bold" as="span">
								{pageCount}
							</Text>
						</Text>
					</>
				)}
				<Text flexShrink="0">Go to Page:</Text>
				<Flex alignItems="center" mr={2}>
					<NumberInput
						ml={2}
						w={16}
						min={1}
						max={pageCount}
						onChange={(value) => {
							let page = parseInt(value, 10);
							if (isNaN(page)) {
								page = pageCount;
							} else {
								page = Math.min(Math.max(page, 1), pageCount);
							}
							gotoPage(page - 1);
							updateQueryObj({ page: page - 1 });
						}}
						value={pageIndex + 1}
					>
						<NumberInputField />
						<NumberInputStepper>
							<NumberIncrementStepper />
							<NumberDecrementStepper />
						</NumberInputStepper>
					</NumberInput>
				</Flex>
				<Select
					w={32}
					value={pageSize}
					onChange={(e) => {
						setPageSize(Number(e.target.value));
						updateQueryObj({ limit: Number(e.target.value) });
					}}
				>
					{[10, 20, 30, 40, 50].map((pageSize) => (
						<option key={pageSize} value={pageSize}>
							Show {pageSize}
						</option>
					))}
				</Select>
			</Flex>

			{!isMobile && (
				<Flex>
					<Tooltip label="Next Page">
						<IconButton
							backgroundColor="#000000"
							color="white"
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
							onClick={() => {
								nextPage();
								updateQueryObj({ page: pageIndex + 1 });
							}}
							isDisabled={!canNextPage}
							icon={<ChevronRightIcon h={6} w={6} />}
							mr={4}
						/>
					</Tooltip>
					<Tooltip label="Last Page">
						<IconButton
							backgroundColor="#000000"
							color="white"
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
							onClick={() => {
								updateQueryObj({ page: pageCount - 1 });
								gotoPage(pageCount - 1);
							}}
							isDisabled={!canNextPage}
							icon={<ArrowRightIcon h={3} w={3} />}
						/>
					</Tooltip>
				</Flex>
			)}
			{isMobile && (
				<Flex mt={4}>
					<Tooltip label="Previous Page">
						<IconButton
							backgroundColor="#000000"
							color="white"
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
							onClick={() => {
								previousPage();
								updateQueryObj({ page: pageIndex - 1 });
							}}
							isDisabled={!canPreviousPage}
							icon={<ChevronLeftIcon h={6} w={6} />}
							mr={2}
						/>
					</Tooltip>
					<>
						<Text flexShrink="0" mx={4} my={2}>
							Page{" "}
							<Text fontWeight="bold" as="span">
								{pageIndex + 1}
							</Text>{" "}
							of{" "}
							<Text fontWeight="bold" as="span">
								{pageCount}
							</Text>
						</Text>
					</>
					<Tooltip label="Next Page">
						<IconButton
							backgroundColor="#000000"
							color="white"
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
							onClick={() => {
								nextPage();
								updateQueryObj({ page: pageIndex + 1 });
							}}
							isDisabled={!canNextPage}
							icon={<ChevronRightIcon h={6} w={6} />}
							ml={2}
						/>
					</Tooltip>
				</Flex>
			)}
		</Flex>
	);
}

export default Pagination;
