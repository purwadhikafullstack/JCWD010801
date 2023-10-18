export const censorInvoice = (invoice) => {
	if (invoice.length < 18) {
		return "INV/****/APM/**********";
	} else {
		const firstPart = invoice.slice(0, 7);
		const middlePart = invoice.slice(-12, -6);
		const censoredPart = "*******";
		const lastPart = invoice.slice(-2);
		return firstPart + "*/APM/" + middlePart + censoredPart + lastPart;
	}
};
