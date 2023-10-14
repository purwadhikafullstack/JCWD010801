import React from "react";

const RatingBar = ({ filledPercentage }) => {
	const hasReviews = filledPercentage > 0;
	const filledWidth = filledPercentage + "%";
	const unfilledWidth = 100 - filledPercentage + "%";

	const barStyles = {
		display: "flex",
		width: "80%",
		height: "20px",
	};

	const filledStyles = {
		width: filledWidth,
		backgroundColor: "#DA9100",
		borderTopLeftRadius: "10px",
		borderBottomLeftRadius: "10px",
	};

	const unfilledStyles = {
		width: unfilledWidth,
		backgroundColor: "grey",
		borderTopLeftRadius: !hasReviews ? "10px" : null,
		borderBottomLeftRadius: !hasReviews ? "10px" : null,
		borderTopRightRadius: "10px",
		borderBottomRightRadius: "10px",
	};

	return (
		<div style={barStyles}>
			<div style={filledStyles}>&nbsp;</div>
			<div style={unfilledStyles}>&nbsp;</div>
		</div>
	);
};

export default RatingBar;
