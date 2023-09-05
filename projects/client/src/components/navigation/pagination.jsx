import { Button, Flex } from "@chakra-ui/react";

export const Pagination = ({ page, totalPages, prevPage, nextPage, goToPage, lastPage }) => {
	const getPageButtons = () => {
		const pagesToShow = 6;
		const pageButtons = [];
		let startPage = Math.max(1, Math.min(page - Math.floor(pagesToShow / 2), totalPages - pagesToShow + 1));
		let endPage = Math.min(totalPages, startPage + pagesToShow - 1);

		const pagesDiff = pagesToShow - (endPage - startPage + 1);
		if (pagesDiff > 0) {
			if (startPage === 1) {
				endPage += pagesDiff;
			} else {
				startPage -= pagesDiff;
			}
		}

		if (page > 1) {
			pageButtons.push(
				<Button
					key="prev"
					onClick={prevPage}
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
				>
					Prev.
				</Button>
			);
		} else {
			pageButtons.push(
				<Button key="prev-disabled" isDisabled backgroundColor="#000000" color="white">
					Prev.
				</Button>
			);
		}

		if (page > 1) {
			pageButtons.push(
				<Button
					key="first"
					onClick={() => goToPage(1)}
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
				>
					First
				</Button>
			);
		} else {
			pageButtons.push(
				<Button key="first-disabled" isDisabled backgroundColor="#000000" color="white">
					First
				</Button>
			);
		}

		const middlePageIndex = Math.round((startPage + endPage) / 2);
		for (let i = startPage; i <= endPage; i++) {
			const isCurrentPage = i === page;
			if (i === middlePageIndex) {
				pageButtons.push(
					<Button key="show-current-page" isDisabled>
						Page {page} / {totalPages}
					</Button>
				);
			}
			if (i <= totalPages) {
				pageButtons.push(
					<Button
						key={i}
						onClick={() => goToPage(i)}
						backgroundColor={isCurrentPage ? "#F0F0F0" : "#000000"}
						color={isCurrentPage ? "#000000" : "white"}
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
					>
						{i}
					</Button>
				);
			} else {
				pageButtons.push(
					<Button key={i} isDisabled backgroundColor="#000000" color="white">
						{i}
					</Button>
				);
			}
		}

		if (page < lastPage) {
			pageButtons.push(
				<Button
					key="last"
					onClick={() => goToPage(lastPage)}
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
				>
					Last
				</Button>
			);
		} else {
			pageButtons.push(
				<Button key="last-disabled" isDisabled backgroundColor="#000000" color="white">
					Last
				</Button>
			);
		}

		if (page < totalPages) {
			pageButtons.push(
				<Button
					key="next"
					onClick={nextPage}
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
				>
					Next
				</Button>
			);
		} else {
			pageButtons.push(
				<Button key="next-disabled" isDisabled backgroundColor="#000000" color="white">
					Next
				</Button>
			);
		}

		return pageButtons;
	};

	return (
		<Flex justifyContent="center" gap="1rem">
			{getPageButtons()}
		</Flex>
	);
};
