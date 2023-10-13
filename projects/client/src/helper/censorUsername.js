export const censorUsername = (username) => {
	if (username.length <= 2) {
		return "*".repeat(username.length);
	} else {
		const firstChar = username.charAt(0);
		const secondChar = username.charAt(1);
		const lastChar = username.charAt(username.length - 1);
		const censoredPart = "*".repeat(username.length - 3);
		return `${firstChar}${secondChar}${censoredPart}${lastChar}`;
	}
};
