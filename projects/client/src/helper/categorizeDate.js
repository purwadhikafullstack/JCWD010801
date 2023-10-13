export const categorizeDate = (dateStr) => {
	const currentDate = new Date();
	const providedDate = new Date(dateStr);

	const timeDifference = currentDate - providedDate;

	const oneDay = 24 * 60 * 60 * 1000;
	const oneWeek = 7 * oneDay; 
	const oneMonth = 30 * oneDay;
	const oneYear = 365 * oneDay;

	if (timeDifference < oneDay) {
		return "Today";
	} else if (timeDifference < 2 * oneDay) {
		return "Yesterday";
	} else if (timeDifference < oneWeek) {
		return "This Week";
	} else if (timeDifference < 2 * oneWeek) {
		return "Last Week";
	} else if (timeDifference < oneMonth) {
		return "This Month";
	} else if (timeDifference < 2 * oneMonth) {
		return "Last Month";
	} else if (timeDifference < oneYear) {
		const monthsAgo = Math.floor(timeDifference / oneMonth);
		return `${monthsAgo} Month${monthsAgo > 1 ? "s" : ""} Ago`;
	} else if (timeDifference < 2 * oneYear) {
		return "Last Year";
	} else {
		const yearsAgo = Math.floor(timeDifference / oneYear);
		return `${yearsAgo} Year${yearsAgo > 1 ? "s" : ""} Ago`;
	}
};
